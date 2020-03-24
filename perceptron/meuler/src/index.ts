import { Colors, Rectangle, Canvas, CanvasObject, Vector2 } from 'vima';

(function() {

class SlopeField extends CanvasObject {

  private _slopeFunction: (x: number, y: number) => number;
  // private _eulerSolution: Arra

  constructor(slopeFunction: (x: number, y: number) => number) {
    super();
    this._slopeFunction = slopeFunction;
  }

  public draw(context:      CanvasRenderingContext2D,
              bounds:       Rectangle,
              canvasBounds: Rectangle): void
  {
    const columns: number = Math.floor(canvasBounds.width / 30);
    const rows: number = Math.floor(canvasBounds.height / 30);

    const horizontalSpacing = canvasBounds.width / columns;
    const verticalSpacing = canvasBounds.height / rows;

    for (let i = 1; i < columns; ++i) {
      for (let j = 1; j < rows; ++j) {
        const canvasPoint: Vector2 = new Vector2(
          i * horizontalSpacing, j * verticalSpacing
        );
        const point: Vector2 = canvasPoint.coordinatesTransform(
          canvasBounds, bounds
        );
        const direction: Vector2 = new Vector2(
          1, this._slopeFunction(point.x, point.y)
        ).normalize().multiply(10);
        const p1: Vector2 = point.subtract(direction).coordinatesTransform(bounds, canvasBounds);
        const p2: Vector2 = point.add(direction).coordinatesTransform(bounds, canvasBounds);
        const diff: Vector2 = p2.subtract(p1).normalize().multiply(10);
        const cp1: Vector2 = canvasPoint.add(diff);
        const cp2: Vector2 = canvasPoint.subtract(diff);
        const [r, g, b]: [number, number, number] = [
          Colors.mainColor.value.red * 255,
          Colors.mainColor.value.green * 255,
          Colors.mainColor.value.blue * 255
        ];
        context.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.25)`;
        context.lineCap = 'round';
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(cp1.x, cp1.y);
        context.lineTo(cp2.x, cp2.y);
        context.stroke();
      }
    }
  }
}

class Solutions extends CanvasObject {

  private _point: Vector2;
  public fill: boolean = false;
  private _exactSolutionPoints: Array<Vector2> = [];
  private _eulerSolutionPoints: Array<Vector2> = [];
  public exactSolutionFunction: (x: number, p: Vector2) => number;
  private _slopeFunction: (x: number, y: number) => number;
  private _eulerFillIndex: number | undefined = undefined;
  private _eulerDelta: number = 0.25;

  constructor(exactSolution: (x: number, p: Vector2) => number,
              slopeFunction: (x: number, y: number) => number,
              point:         Vector2 = new Vector2(0, 0))
  {
    super();
    this.exactSolutionFunction = exactSolution;
    this._point = point;
    this._slopeFunction = slopeFunction;
    this.computeExactSolution();
    this.computeEulerSolution();
  }

  public draw(context:      CanvasRenderingContext2D,
              bounds:       Rectangle,
              canvasBounds: Rectangle): void
  {
    // Draw Euler solution
    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = Colors.redColor.value.toCSS(false);
    for (let point of this._eulerSolutionPoints) {
      context.lineTo(point.x, point.y);
    }
    context.stroke();

    for (let i = 0; i < this._eulerSolutionPoints.length; ++i) {
      const point: Vector2 = this._eulerSolutionPoints[i];
      context.beginPath();
      context.arc(point.x, point.y, 5, 0, 2 * Math.PI);

      if (this._eulerFillIndex !== undefined && this._eulerFillIndex === i) {
        context.fillStyle = Colors.redColor.value.toCSS(false);
      } else {
        context.fillStyle = Colors.backgroundColor.value.toCSS(false);
      }

      context.fill();
      context.stroke();
    }


    // Draw exact solution
    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = Colors.blueColor.value.toCSS(false);
    for (let point of this._exactSolutionPoints) {
      context.lineTo(point.x, point.y);
    }
    context.stroke();

    const canvasPoint: Vector2 = this.point.coordinatesTransform(bounds, canvasBounds);

    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = Colors.blueColor.value.toCSS(false);

    if (this.fill) {
      context.fillStyle = Colors.blueColor.value.toCSS(false);
    } else {
      context.fillStyle = Colors.backgroundColor.value.toCSS(false);
    }
    context.beginPath();
    context.arc(canvasPoint.x, canvasPoint.y, 10, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
  }

  public get point(): Vector2 {
    return this._point;
  }

  public set point(point: Vector2) {
    this._point = point;
    this.computeExactSolution();
    this.computeEulerSolution();
  }

  public set eulerFillIndex(eulerFillIndex: number | undefined) {
    this._eulerFillIndex = eulerFillIndex;
  }

  public computeExactSolution() {
    this._exactSolutionPoints = [];
    for (let i = canvas.bounds.left; i <= canvas.bounds.right + 0.05; i += 0.05) {
      this._exactSolutionPoints.push(new Vector2(
        i, this.exactSolutionFunction(i, this._point)
      ).coordinatesTransform(canvas.bounds, canvas.canvasBounds));
    }
  }

  public computeEulerSolution() {
    this._eulerSolutionPoints = [this._point.coordinatesTransform(canvas.bounds, canvas.canvasBounds)];
    let now: Vector2 = this._point
    while (canvas.bounds.left - 0.25 <= now.x && now.x <= canvas.bounds.right + 0.25) {
      const next: Vector2 = new Vector2(now.x + this._eulerDelta, now.y + this._eulerDelta * this._slopeFunction(now.x, now.y));
      const direction: Vector2 = next.subtract(now).normalize();
      now = now.add(direction.multiply(Math.abs(this._eulerDelta)));
      this._eulerSolutionPoints.push(
        now.coordinatesTransform(canvas.bounds, canvas.canvasBounds)
      );
    }
  }

  public get eulerParticles(): readonly Vector2[] {
    return Object.freeze(this._eulerSolutionPoints);
  }

  public set eulerDelta(eulerDelta: number) {
    this._eulerDelta = eulerDelta;
    this.computeEulerSolution();
  }

  public get eulerDelta(): number {
    return this._eulerDelta;
  }
 }

const canvas: Canvas = new Canvas('canvas');
canvas.scale = 3;
canvas.addObject(new SlopeField((x, y) => Math.sin(x) + y));
const solutions: Solutions = new Solutions((x: number, p: Vector2) => {
  const c = 1 / 2 * Math.exp(-p.x) * (Math.cos(p.x) + Math.sin(p.x) + 2 * p.y);
  return c * Math.exp(x) - Math.sin(x) / 2 - Math.cos(x) / 2;
}, (x, y) => Math.sin(x) + y);
canvas.addObject(solutions);
const HANDLE_RADIUS = 10;

let mouseDown: boolean = false;
let mouseDownEulerIndex: number | undefined = undefined;
let mouseDownX: number = 0;
let mouseDownDelta: number = 0;

function mathcesMainPoint(p1: Vector2): boolean {
  const p2: Vector2 = solutions.point.coordinatesTransform(canvas.bounds, canvas.canvasBounds);
  return p1.distance(p2) < 2 * HANDLE_RADIUS;
}

function getMatchingEulerIndex(p1: Vector2, mult: number = 1): number | undefined {
  for (let i = 0; i < solutions.eulerParticles.length; ++i) {
    const p2: Vector2 = solutions.eulerParticles[i];
    if (p1.distance(p2) < mult * HANDLE_RADIUS) {
      return i;
    }
  }
  return undefined;
}

canvas.canvasElement.addEventListener('mousedown', (event: MouseEvent) => {
  if (canvas.paused) return;

  const [x, y] = [
    event.pageX - canvas.canvasElement.offsetLeft,
    event.pageY - canvas.canvasElement.offsetTop
  ];
  const p1: Vector2 = new Vector2(x, y);
  mouseDownX = p1.coordinatesTransform(canvas.canvasBounds, canvas.bounds).x;
  mouseDownDelta = solutions.eulerDelta;

  if (mathcesMainPoint(p1)) {
    mouseDown = true;
    solutions.fill = true;
    document.body.style.cursor = 'grabbing';
  } else {
    const matchingIndex = getMatchingEulerIndex(p1);
    if (matchingIndex !== undefined) {
      solutions.eulerFillIndex = matchingIndex;
      mouseDownEulerIndex = matchingIndex;
      document.body.style.cursor = 'grabbing';
    }
  }
});

canvas.canvasElement.addEventListener('mouseup', (event: MouseEvent) => {
  mouseDown = false;
  mouseDownEulerIndex = undefined;
  solutions.eulerFillIndex = undefined;

  const [x, y] = [
    event.pageX - canvas.canvasElement.offsetLeft,
    event.pageY - canvas.canvasElement.offsetTop
  ];
  const p1: Vector2 = new Vector2(x, y);

  if (!mathcesMainPoint(p1) && getMatchingEulerIndex(p1) === undefined) {
    document.body.style.cursor = '';
  } else {
    document.body.style.cursor = 'grab';
  }
});

canvas.canvasElement.addEventListener('mousemove', (event: MouseEvent) => {
  if (canvas.paused) return;

  const [x, y] = [
    event.pageX - canvas.canvasElement.offsetLeft,
    event.pageY - canvas.canvasElement.offsetTop
  ];
  const p1: Vector2 = new Vector2(x, y);
  if (mouseDown) {
    solutions.point = new Vector2(x, y)
      .coordinatesTransform(canvas.canvasBounds, canvas.bounds);
    document.body.style.cursor = 'grabbing';
  } else if (mouseDownEulerIndex !== undefined) {
    document.body.style.cursor = 'grabbing';
    let newDelta: number = mouseDownDelta + (p1.coordinatesTransform(canvas.canvasBounds, canvas.bounds).x - mouseDownX) / mouseDownEulerIndex;
    if (0 <= newDelta && newDelta <= 0.25) {
      newDelta = 0.25;
    } else if (-0.25 <= newDelta && newDelta < 0) {
      newDelta = -0.25;
    }
    solutions.eulerDelta = newDelta;
  } else {
    solutions.fill = false;
    document.body.style.cursor = '';
    solutions.eulerFillIndex = undefined;
    if (mathcesMainPoint(p1)) {
      solutions.fill = true;
      document.body.style.cursor = 'grab';
    } else {
      const matchingIndex = getMatchingEulerIndex(p1);
      if (matchingIndex !== undefined) {
        solutions.eulerFillIndex = matchingIndex;
        document.body.style.cursor = 'grab';
      }
    }
  }
});

canvas.canvasElement.addEventListener('touchstart', (event: TouchEvent): void => {
  if (canvas.paused) return;

  if (!event.cancelable) return;
  event.preventDefault();

  const [x, y] = [
    event.touches[0].pageX - canvas.canvasElement.offsetLeft,
    event.touches[0].pageY - canvas.canvasElement.offsetTop
  ];
  const p1: Vector2 = new Vector2(x, y);

  mouseDownX = p1.coordinatesTransform(canvas.canvasBounds, canvas.bounds).x;
  mouseDownDelta = solutions.eulerDelta;

  if (mathcesMainPoint(p1)) {
    mouseDown = true;
    solutions.fill = true;
  } else {
    const matchingIndex = getMatchingEulerIndex(p1, 2);
    if (matchingIndex !== undefined) {
      mouseDownEulerIndex = matchingIndex;
      solutions.eulerFillIndex = matchingIndex;
    }
  }
});

canvas.canvasElement.addEventListener('touchmove', (event: TouchEvent): void => {
  if (canvas.paused) return;
  if (!event.cancelable) return;
  event.preventDefault();

  const [x, y] = [
    event.touches[0].pageX - canvas.canvasElement.offsetLeft,
    event.touches[0].pageY - canvas.canvasElement.offsetTop
  ];

  const p1: Vector2 = new Vector2(x, y);

  if (mouseDown) {
    solutions.point = new Vector2(x, y)
      .coordinatesTransform(canvas.canvasBounds, canvas.bounds);
  } else if (mouseDownEulerIndex !== undefined) {
    let newDelta: number = mouseDownDelta + (p1.coordinatesTransform(canvas.canvasBounds, canvas.bounds).x - mouseDownX) / mouseDownEulerIndex;
    if (0 <= newDelta && newDelta <= 0.25) {
      newDelta = 0.25;
    } else if (-0.25 <= newDelta && newDelta < 0) {
      newDelta = -0.25;
    }
    solutions.eulerDelta = newDelta;
  }
});

canvas.canvasElement.addEventListener('touchend', () => {
  solutions.fill = false;
  solutions.eulerFillIndex = undefined;
  mouseDown = false;
  mouseDownEulerIndex = undefined;
});

window.addEventListener('message', (event: MessageEvent) => {
  switch (event.data) {
    case 'start':
      canvas.play();
      break;
    case 'pause':
      canvas.pause();
      document.body.style.cursor = '';
      break;
  }
});

window.addEventListener('resize', () => {
  solutions.computeEulerSolution();
  solutions.computeExactSolution();
});

})();
