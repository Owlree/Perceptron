import * as vima from 'vima';

const bounds: vima.Rectangle = new vima.Rectangle(
  new vima.Vector2(-Math.PI, 1.2), new vima.Vector2(Math.PI, -1.2));

// Create an instance of the graphing calculator
const graphingCalculator = new vima.GraphingCalculator('canvas', bounds);

const a0: vima.Vector2 = new vima.Vector2(0, -1);

let balls: Array<{
  point: vima.FreePointGraphic,
  s0: vima.Vector2,
  v0: vima.Vector2,
  t0: number
}> = [];

let currentTime: number = 0;

graphingCalculator.on('frame', ({time}: vima.Event) => {
  currentTime = time;
  for (let {point, s0, t0, v0} of balls) {
    const t: number = time - t0;
    const x: number = s0.x + v0.x * t + a0.x * t * t / 2;
    const y: number = s0.y + v0.y * t + a0.y * t * t / 2;
    point.position = new vima.Vector2(x, y);
  }
  balls = balls.filter(({point}) => {
    const out: boolean =
      bounds.left   > point.bounds.right ||
      bounds.bottom > point.bounds.top   ||
      bounds.right  < point.bounds.left;
    if (out) {
      graphingCalculator.remove(point);
    }
    return !out;
  });
});

let fromPoint: vima.FreePointGraphic | undefined = undefined;
let toPoint: vima.FreePointGraphic | undefined = undefined;
let vector: vima.VectorGraphic | undefined = undefined;

const mouseDown = (event: MouseEvent | TouchEvent) => {
  event.preventDefault();
  fromPoint = new vima.FreePointGraphic({
    x: graphingCalculator.mousePosition.x,
    y: graphingCalculator.mousePosition.y,
    interactive: false
  });
  toPoint = new vima.FreePointGraphic({
    type: vima.PointGraphicType.Triangle,
    x: graphingCalculator.mousePosition.x,
    y: graphingCalculator.mousePosition.y,
    interactive: false
  });
  vector = new vima.VectorGraphic(fromPoint, toPoint);
  graphingCalculator.add(vector);
  graphingCalculator.add(toPoint);
  graphingCalculator.add(fromPoint);
};

const mouseMove = (event: MouseEvent | TouchEvent) => {
  event.preventDefault();
  if (toPoint !== undefined) {
    toPoint.position = graphingCalculator.mousePosition;
  }
};

const mouseUp = (event: MouseEvent | TouchEvent) => {
  event.preventDefault();
  let newBall = {
    point: new vima.FreePointGraphic({interactive: false}),
    s0: fromPoint!.position,
    v0: vector!.vector2,
    t0: currentTime
  };
  balls.push(newBall);
  graphingCalculator.add(newBall.point);
  graphingCalculator.remove(fromPoint!);
  graphingCalculator.remove(toPoint!);
  graphingCalculator.remove(vector!);
  fromPoint = undefined;
  toPoint = undefined;
  vector = undefined;
};

document.body.addEventListener('mousedown', mouseDown);
document.body.addEventListener('mousemove', mouseMove);
document.body.addEventListener('mouseup', mouseUp);

// Add support for touch interaction
document.body.addEventListener('touchstart', mouseDown);
document.body.addEventListener('touchmove', mouseMove);
document.body.addEventListener('touchend', mouseUp);
