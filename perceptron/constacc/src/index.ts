import * as vima from 'vima';

interface PointWithMetadata {
  point: vima.FreePointGraphic;
  s0: vima.Vector2; // Initial position
  v0: vima.Vector2; // Initial velocity
  t0: number; // Initial time (spawn time)
}

const bounds: vima.Rectangle = new vima.Rectangle(
  new vima.Vector2(-2.4, 1.2), new vima.Vector2(2.4, -1.2));

// Create an instance of the graphing calculator
const graphingCalculator = new vima.GraphingCalculator('canvas', bounds);

// Constant acceleration vector (gravitational)
const a0: vima.Vector2 = new vima.Vector2(0, -1);

// An array of balls, each with a point and some metadata
let balls: Array<PointWithMetadata> = [];

let currentTime: number = 0;
graphingCalculator.on('frame', ({time}: vima.Event) => {

  // Update the current time
  currentTime = time;

  // Update the positions of all balls
  for (let {point, s0, t0, v0} of balls) {
    const t: number = time - t0;
    const x: number = s0.x + v0.x * t + a0.x * t * t / 2;
    const y: number = s0.y + v0.y * t + a0.y * t * t / 2;
    point.position = new vima.Vector2(x, y);
  }

  // Remove balls that are out of bounds and irrecuperrable
  balls = balls.filter(({point}) => {
    const isOut: boolean =
      bounds.left   > point.bounds.right ||
      bounds.bottom > point.bounds.top   ||
      bounds.right  < point.bounds.left;
    if (isOut) {
      graphingCalculator.remove(point);
    }
    return !isOut;
  });
});

let fromPoint: vima.FreePointGraphic | undefined = undefined;
let toPoint: vima.FreePointGraphic | undefined = undefined;
let vector: vima.VectorGraphic | undefined = undefined;

const mouseDown = (event: MouseEvent | TouchEvent) => {

  // Do not interrupt scrolling on mobile
  if (!event.cancelable) return;

  event.preventDefault();

  // Create a point to represent the initial position
  fromPoint = new vima.FreePointGraphic({
    x: graphingCalculator.mousePosition.x,
    y: graphingCalculator.mousePosition.y,
    interactive: false
  });

  // Create a point to represent the head of the initial vector velocity
  toPoint = new vima.FreePointGraphic({
    type: vima.PointGraphicType.Triangle,
    x: graphingCalculator.mousePosition.x,
    y: graphingCalculator.mousePosition.y,
    interactive: false
  });

  // Create a vector graphing to represnt the initial velocity
  vector = new vima.VectorGraphic(fromPoint, toPoint);

  // Add all of them to the graphing calculator
  graphingCalculator.add(vector);
  graphingCalculator.add(toPoint);
  graphingCalculator.add(fromPoint);
};

const mouseMove = (event: MouseEvent | TouchEvent) => {

  // Do not interrupt scrolling on mobile
  if (!event.cancelable) return;

  event.preventDefault();

  if (toPoint !== undefined) {
    toPoint.position = graphingCalculator.mousePosition;
  }
};

const mouseUp = (_: MouseEvent | TouchEvent) => {

  // Guard against these object being absent
  if (fromPoint === undefined ||
      toPoint   === undefined ||
      vector    === undefined) return;

  // Spawn a new ball and retain some metadata
  let newBall = {
    point: new vima.FreePointGraphic({interactive: false}),
    s0: fromPoint.position,
    v0: vector.vector2,
    t0: currentTime
  };
  balls.push(newBall);
  graphingCalculator.add(newBall.point);

  // Make sure to unregister callback in order to avoid memory leaks
  fromPoint.unregisterAllVariableCallbacks();
  toPoint.unregisterAllVariableCallbacks();
  vector.unregisterAllVariableCallbacks();

  // Remove all from the graphing calculator
  graphingCalculator.remove(fromPoint);
  graphingCalculator.remove(toPoint);
  graphingCalculator.remove(vector);

  // Delete all references
  fromPoint = undefined;
  toPoint = undefined;
  vector = undefined;
};

if ('ontouchstart' in window) {
  // TODO (Owlree) Implement multitouch
  graphingCalculator.canvas.addEventListener('touchstart', mouseDown);
  graphingCalculator.canvas.addEventListener('touchmove', mouseMove);
  graphingCalculator.canvas.addEventListener('touchend', mouseUp);
} else {
  graphingCalculator.canvas.addEventListener('mousedown', mouseDown);
  graphingCalculator.canvas.addEventListener('mousemove', mouseMove);
  graphingCalculator.canvas.addEventListener('mouseup', mouseUp);
  graphingCalculator.canvas.addEventListener('mouseleave', mouseUp);
}
