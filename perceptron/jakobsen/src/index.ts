import { Color, Colors, CanvasObject, Rectangle, Canvas, Vector2 } from 'vima';

// Script scope
(function() {

class Jakobsen extends CanvasObject {

  private _timeElapsed: number;
  private _desiredSegmentLength: number;
  private _states: Array<{
    positions: Array<number>;
    segment: number;
    steps: number;
  }>;

  constructor() {
    super();

    const positions: Array<number> = [];
    this._desiredSegmentLength = 0.04 / 2;
    this._timeElapsed = 0;

    for (let i = 0; i < 1; i += 0.04) {
      positions.push(i);
    }
    positions.push(1);

    this._states = [{
      positions: positions,
      segment: 0,
      steps: 0
    }];
  }

  private getNextState({
    positions, segment, steps
  }: {
    positions: Array<number>;
    segment: number;
    steps: number;
  }): {
    positions: Array<number>;
    segment: number;
    steps: number;
  } {
    const newPositions: Array<number> = [];
    for (let i of positions) {
      newPositions.push(i);
    }
    const i: number = segment;
    const difference: number = newPositions[i + 1] - newPositions[i] - this._desiredSegmentLength;
    newPositions[i] += difference / 2;
    newPositions[i + 1] -= difference / 2;

    return {
      positions: newPositions,
      segment: (segment + 1) % (positions.length - 1),
      steps: steps + 1
    };
  }

  public update(dt: number, _: number) {
    if (paused || dragStartPosition !== undefined) {
      this._timeElapsed = this._states.length * 0.05;
      return;
    }
    this._timeElapsed += dt;
    while (this._timeElapsed / 0.05 > this._states.length) {
      this.next();
    }
  }

  public next(): void {
    this._states.push(this.getNextState(this._states[this._states.length - 1]));
  }

  public prev(): void {
    if (this._states.length > 1) {
      this._states.pop();
    }
  }

  public draw(context: CanvasRenderingContext2D, _: Rectangle, __: Rectangle) {

    const { positions } = this._states[this._states.length - 1];

    for (let i = 0; i < positions.length - 1; ++i) {
      const segmentLength: number = positions[i + 1] - positions[i];
      const percentage: number = Math.abs(1 - segmentLength / this._desiredSegmentLength);
      const color: Color = Colors.blueColor.mix(Colors.redColor, percentage);

      context.fillStyle = color.toCSS();

      const canvasBegin: number = canvas.canvasBounds.left + positions[i] * canvas.canvasBounds.width;
      const canvasEnd: number = canvas.canvasBounds.left + positions[i + 1] * canvas.canvasBounds.width;

      context.fillRect(Math.floor(canvasBegin), canvas.canvasBounds.top, Math.ceil(canvasEnd - canvasBegin), canvas.canvasBounds.height);
    }

  }
}

const canvas = new Canvas('canvas');
canvas.canvasElement.style.cursor = 'pointer';
let jakobsen = new Jakobsen();
canvas.addObject(jakobsen);
let paused: boolean = false;


canvas.canvasElement.addEventListener('dblclick', (_: MouseEvent) => {
  paused = true;
  canvas.removeOBject(jakobsen);
  jakobsen = new Jakobsen();
  canvas.addObject(jakobsen);
});

let dragStartPosition: Vector2 | undefined = undefined;
let stepsTaken: number = 0;
canvas.canvasElement.addEventListener('mousedown', (event: MouseEvent) => {
  if (dragStartPosition === undefined) {
    const [x, y] = [
      event.pageX - canvas.canvasElement.offsetLeft,
      event.pageY - canvas.canvasElement.offsetTop
    ];
    canvas.canvasElement.style.cursor = 'move';
    dragStartPosition = new Vector2(x, y);
    stepsTaken = 0;
  }
});

canvas.canvasElement.addEventListener('mousemove', (event: MouseEvent) => {

  if (dragStartPosition !== undefined) {
    const [x, y] = [
      event.pageX - canvas.canvasElement.offsetLeft,
      event.pageY - canvas.canvasElement.offsetTop
    ];
    const position: Vector2 = new Vector2(x, y);
    const percentage: number = (position.x - dragStartPosition.x) / canvas.canvasBounds.width;
    const steps: number = percentage / 0.01;
    if (steps < 0) {
      while (stepsTaken > steps) {
        stepsTaken -= 1;
        jakobsen.prev();
      }
      while (stepsTaken < steps) {
        stepsTaken += 1;
        jakobsen.next();
      }
    } else {
      while (stepsTaken < steps) {
        stepsTaken += 1;
        jakobsen.next();
      }
      while (stepsTaken > steps) {
        stepsTaken -= 1;
        jakobsen.prev();
      }
    }
  }
});

canvas.canvasElement.addEventListener('mouseup', (event: MouseEvent) => {
  if (dragStartPosition !== undefined) {
    const [x, y] = [
      event.pageX - canvas.canvasElement.offsetLeft,
      event.pageY - canvas.canvasElement.offsetTop
    ];
    const position: Vector2 = new Vector2(x, y);
    if (Math.abs(position.x - dragStartPosition.x) / canvas.canvasBounds.width > 0.01) {
      paused = true;
    } else {
      paused = !paused;
    }
  }
  canvas.canvasElement.style.cursor = 'pointer';
  dragStartPosition = undefined;
});



})();
