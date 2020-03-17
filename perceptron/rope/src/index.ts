import { Colors, Vector2, Rectangle } from 'vima';
import { Node } from './node';

(function() {

class Point extends Node {

  public grabbed: boolean = false;
  public position: Vector2;
  public previousPosition: Vector2;

  public draw(context:      CanvasRenderingContext2D,
              bounds:       Rectangle,
              canvasBounds: Rectangle)
  {
    // Convert position
    const position: Vector2 = this.position.coordinatesTransform(bounds, canvasBounds);
    context.fillStyle = Colors.redColor.value.toCSS();
    context.beginPath();
    context.arc(position.x, position.y, 5, 0, 2 * Math.PI);
    context.fill();
  }

  constructor(x: number, y: number) {
    super();
    this.position = new Vector2(x, y);
    this.previousPosition = this.position;
  }
}

class Constraint extends Node {

  private _point1: Point;
  private _point2: Point;
  private _minDistance: number;
  private _maxDistance: number;

  constructor(point1: Point, point2: Point, minDistance: number, maxDistance: number) {
    super();
    [this._point1, this._point2] = [point1, point2];
    [this._minDistance, this._maxDistance] = [minDistance, maxDistance];
  }

  public relax() {
    const r = this._point2.position.subtract(this._point1.position).normalize();
    const d = this._point2.position.subtract(this._point1.position).length();

    let dd = 0;

    if (d < this._minDistance) {
      dd = d - this._minDistance;
    } else if (this._maxDistance < d) {
      dd = d - this._maxDistance;
    }

    let w1 = 1 / 2;
    let w2 = 1 / 2;

    if (this._point1.grabbed && this._point2.grabbed) {
      w1 = w2 = 0;
    } else if (this._point1.grabbed) {
      w1 = 0;
      w2 = 1;
    } else if (this._point2.grabbed) {
      w1 = 1;
      w2 = 0;
    }

    this._point1.position = this._point1.position.add(r.multiply(dd * w1));
    this._point2.position = this._point2.position.subtract(r.multiply(dd * w2));
  }

  public draw(context:      CanvasRenderingContext2D,
              bounds:       Rectangle,
              canvasBounds: Rectangle)
  {
    if (!this.visible) return;

    const v1 = this._point1.position.coordinatesTransform(bounds, canvasBounds);
    const v2 = this._point2.position.coordinatesTransform(bounds, canvasBounds);
    const d = this._point1.position.distance(this._point2.position);

    if (d < this._minDistance - 0.001 || this._maxDistance + 0.001 < d) {
      context.strokeStyle = Colors.redColor.value.toCSS();
    } else {
      context.strokeStyle = Colors.blueColor.value.toCSS();
    }
    context.lineWidth = 5;
    context.lineCap = 'round';

    context.beginPath();
    context.moveTo(v1.x, v1.y);
    context.lineTo(v2.x, v2.y);
    context.stroke();
  }
}

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d')!;

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let bounds = new Rectangle(new Vector2(0, 0), new Vector2(16, -9));
let canvasBounds = new Rectangle(new Vector2(0, 0), new Vector2(canvas.width, canvas.height));

const points: Array<Point> = [];

for (let i = 1; i <= 75; ++i) {
  points.push(new Point((i - 1) / 75, 0.5 - i / 75));
}

points[0].grabbed = true;

window.addEventListener('resize', () => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  bounds = new Rectangle(new Vector2(0, 0), new Vector2(16, -9));
  canvasBounds = new Rectangle(new Vector2(0, 0), new Vector2(canvas.width, canvas.height));
})

const constraints: Array<Constraint> = [];

for (let i = 1; i < 10; ++i) {
  for (let j = i; j < points.length; j += 1) {
    const constraint = new Constraint(points[j - i], points[j], 0, 0.09 * i);
    constraint.visible = i == 1;
    constraints.push(constraint);
  }
}

// constraints.push(new Constraint(points[0], points[99], 0, 0.01 * points.length + 0.15));
// constraints[constraints.length - 1].visible = false;

function draw() {
  for (let constraint of constraints) {
    constraint.draw(context, bounds, canvasBounds);
  }
  // for (let point of points) {
  //   point.draw(context, bounds, canvasBounds);
  // }
}

function simulate(_: number) {

  const acc = new Vector2(0, -10);

  for (let point of points) {
    if (point.grabbed) continue;
    const previousPosition = point.position;
    point.position = point.position.multiply(2).subtract(point.previousPosition).add(acc.multiply(DELTA * DELTA));
    point.previousPosition = previousPosition;
  }

  for (let i = 0; i < 10; ++i) {
    for (let constraint of constraints) {
      constraint.relax();
    }
  }
}

let time = new Date().getTime() / 1000;
let myTime = new Date().getTime() / 1000;
const DELTA = 1 / 30;

function loop() {

  // Clear the canvas
  context.fillStyle = Colors.backgroundColor.value.toCSS();
  context.fillRect(0, 0, canvas.width, canvas.height);

  time = new Date().getTime() / 1000;

  let count: number = 0;
  while (myTime < time && count < 20) {
    simulate(myTime);
    myTime += DELTA;
    count += 1;
  }

  console.log(count);

  draw();

  requestAnimationFrame(loop);
}

loop();

canvas.addEventListener('mousemove', (event: MouseEvent) => {
  points[0].position = new Vector2(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop).coordinatesTransform(canvasBounds, bounds);
});

})();
