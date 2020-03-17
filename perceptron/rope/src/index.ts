import { Colors, Vector2, Rectangle } from 'vima';
import { Node } from './node';

(function() {

class Point extends Node {
  public grabbed: boolean = false;
  public position: Vector2;
  public previousPosition: Vector2;

  public draw(
    context:      CanvasRenderingContext2D,
    bounds:       Rectangle,
    canvasBounds: Rectangle)
  {
    if (!this.visible) return;

    const r: number = this.grabbed ? 10 : 2;
    const position: Vector2 = this.position.coordinatesTransform(bounds, canvasBounds);
    context.fillStyle = Colors.blueColor.value.toCSS();
    context.beginPath();
    context.arc(position.x, position.y, r, 0, 2 * Math.PI);
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

  constructor(
    point1:      Point,
    point2:      Point,
    minDistance: number,
    maxDistance: number)
  {
    super();
    [this._point1, this._point2] = [point1, point2];
    [this._minDistance, this._maxDistance] = [minDistance, maxDistance];
  }

  public relax() {
    const p: Vector2 = this._point1.position;
    const r: Vector2 = this._point2.position.subtract(p).normalize();
    const d: number = this._point2.position.subtract(p).length();
    let dd: number = 0;
    if (d < this._minDistance) {
      dd = d - this._minDistance;
    } else if (this._maxDistance < d) {
      dd = d - this._maxDistance;
    }

    let w1: number = 1 / 2;
    let w2: number = 1 / 2;

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

  public draw(
    context:      CanvasRenderingContext2D,
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
    context.lineWidth = 2;
    context.lineCap = 'round';

    context.beginPath();
    context.moveTo(v1.x, v1.y);
    context.lineTo(v2.x, v2.y);
    context.stroke();
  }
}

function buildRope(bounds: Rectangle): { points: Array<Point>; constraints: Array<Constraint> } {

  let points: Array<Point> = [];
  let constraints: Array<Constraint> = [];

  const d = 1 / 75 * bounds.height * 0.5;

  const nodes = 75;

  for (let i = 0; i < nodes; ++i) {
    const point = new Point(bounds.center.x, bounds.center.y - i * d + nodes * d / 2);
    point.visible = false;
    points.push(point);
  }
  points[0].grabbed = true;
  points[0].visible = true;

  for (let i = 1; i < 10; ++i) {
    for (let j = i; j < points.length; j += 1) {
      const constraint = new Constraint(points[j - i], points[j], 0, d * i);
      constraint.visible = false;
      constraints.push(constraint);
    }
  }

  return {
    points: points,
    constraints: constraints
  };
}

function buildCloth(bounds: Rectangle): { points: Array<Point>; constraints: Array<Constraint> } {

  let points: Array<Point> = [];
  let constraints: Array<Constraint> = [];

  const columns = 15;
  const rows = 25;

  for (let i = 0; i < rows; ++i) {
    for (let j = 0; j < columns; ++j) {
      points.push(
        new Point(
          bounds.left + j / (columns - 1) * bounds.width / 4 + bounds.width / 4 + bounds.width / 8,
          bounds.top - i / (rows - 1) * bounds.height / 2 - bounds.height / 4
        )
      );
    }
  }

  for (let i = 0; i < columns * rows; ++i) {
    const p1 = points[i];

    // To the right
    if ((i + 1) % columns > 0 && i + 1 < columns * rows) {
      const p2 = points[i + 1];
      const d: number = p1.position.distance(p2.position);
      constraints.push(new Constraint(p1, p2, d, d));
    }

    // Below
    if (i + columns < columns * rows) {
      const p2 = points[i + columns];
      const d: number = p1.position.distance(p2.position) * 0.9;
      constraints.push(new Constraint(p1, p2, d, d));
    }
  }

  points[0].grabbed = true;
  points[columns - 1].grabbed = true;

  return {
    points: points,
    constraints: constraints
  };
}

// Initialize the canvas
const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const context: CanvasRenderingContext2D = canvas.getContext('2d')!;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
let bounds = new Rectangle(new Vector2(0, 0), new Vector2(40, -20));
let canvasBounds = new Rectangle(new Vector2(0, 0), new Vector2(canvas.width, canvas.height));

let isRope: boolean = true;
let {points, constraints} = buildRope(bounds);

window.addEventListener('resize', () => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  canvasBounds = new Rectangle(new Vector2(0, 0), new Vector2(canvas.width, canvas.height));
})

function draw() {
  if (isRope) {
    context.strokeStyle = Colors.blueColor.value.toCSS();
    context.lineWidth = 2;
    context.beginPath();
    for (let point of points) {
      const p: Vector2 = point.position.coordinatesTransform(bounds, canvasBounds);
      context.lineTo(p.x, p.y);
    }
    context.stroke();
  }

  for (let constraint of constraints) {
    constraint.draw(context, bounds, canvasBounds);
  }

  for (let point of points) {
    point.draw(context, bounds, canvasBounds);
  }
}

function simulate(_: number) {

  const acc = new Vector2(0, -30);

  for (let point of points) {
    if (point.grabbed) continue;
    const previousPosition = point.position;
    point.position = point.position.multiply(2).subtract(point.previousPosition).add(acc.multiply(DELTA * DELTA));
    point.previousPosition = previousPosition;
  }

  for (let i = 0; i < 15; ++i) {
    for (let constraint of constraints) {
      constraint.relax();
    }
  }
}

let time = new Date().getTime() / 1000;
let myTime = new Date().getTime() / 1000;
const DELTA = 1 / 60;

function loop() {

  // Clear the canvas
  context.fillStyle = Colors.backgroundColor.value.toCSS();
  context.fillRect(0, 0, canvas.width, canvas.height);

  time = new Date().getTime() / 1000;

  let count: number = 0;
  while (myTime < time) {
    if (count < 3) {
      simulate(myTime);
    }
    myTime += DELTA;
    count += 1;
  }

  draw();

  requestAnimationFrame(loop);
}

loop();

let mouseDown: boolean = false;

const onMouseDown = (event: MouseEvent) => {
  const [x, y] = [
    event.pageX - canvas.offsetLeft,
    event.pageY - canvas.offsetTop
  ];
  const p1: Vector2 = new Vector2(x, y);
  const p2: Vector2 = points[0].position.coordinatesTransform(bounds, canvasBounds);

  console.log(p1.array, p2.array);

  if (p1.distance(p2) < 20) {
    mouseDown = true;
  }
};

const onMouseUp = (_: MouseEvent) => {
  mouseDown = false;
};

const onMouseMove = (event: MouseEvent) => {
  if (mouseDown) {
    const [x, y] = [
      event.pageX - canvas.offsetLeft,
      event.pageY - canvas.offsetTop
    ];
    points[0].position = new Vector2(x, y)
      .coordinatesTransform(canvasBounds, bounds);
  }
};

const onTouchMove = (event: TouchEvent): void => {

  if (!event.cancelable) return;
  event.preventDefault();

  const [x, y] = [
    event.touches[0].pageX - canvas.offsetLeft,
    event.touches[0].pageY - canvas.offsetTop
  ];
  points[0].position = new Vector2(x, y)
    .coordinatesTransform(canvasBounds, bounds);
}

if ('ontouchstart' in window) {
  canvas.addEventListener('touchmove', onTouchMove);
} else {
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('mousemove', onMouseMove);
}



document.body.addEventListener('keypress', (_: KeyboardEvent) => {
  if (isRope) {
    let bb = buildCloth(bounds);
    points = bb.points;
    constraints = bb.constraints;
    isRope = false;
  } else {
    let bb = buildRope(bounds);
    points = bb.points;
    constraints = bb.constraints;
    isRope = true;
  }
});

})();
