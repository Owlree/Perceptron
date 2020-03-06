import * as vima from 'vima';

// Create an instance of the graphing calculator
const graphingCalculator = new vima.GraphingCalculator('canvas');

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
});

let fromPoint: vima.FreePointGraphic | undefined = undefined;
let toPoint: vima.FreePointGraphic | undefined = undefined;
let vector: vima.VectorGraphic | undefined = undefined;

document.body.addEventListener('mousedown', () => {
  fromPoint = new vima.FreePointGraphic({
    // interactive: false,
    x: graphingCalculator.mousePosition.x,
    y: graphingCalculator.mousePosition.y
  });
  toPoint = new vima.FreePointGraphic({
    // interactive: false,
    type: vima.PointGraphicType.Triangle,
    x: graphingCalculator.mousePosition.x,
    y: graphingCalculator.mousePosition.y
  });
  vector = new vima.VectorGraphic(fromPoint, toPoint);
  graphingCalculator.add(vector);
  graphingCalculator.add(toPoint);
});

document.body.addEventListener('mousemove', () => {
  if (toPoint !== undefined) {
    toPoint.position = graphingCalculator.mousePosition;
  }
});

document.body.addEventListener('mouseup', () => {
  let newBall = {
    point: new vima.FreePointGraphic(),
    s0: fromPoint!.position,
    v0: vector!.vector2,
    t0: currentTime
  };
  balls.push(newBall);
  graphingCalculator.add(newBall.point);
  fromPoint?.remove();
  toPoint?.remove();
  vector?.remove();
  fromPoint = undefined;
  toPoint = undefined;
  vector = undefined;
});
