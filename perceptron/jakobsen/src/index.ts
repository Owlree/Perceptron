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
    this._desiredSegmentLength = 0.1 / 2;
    this._timeElapsed = 0;

    for (let i = 0; i < 1; i += 0.1) {
      positions.push(i);
    }

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
      context.strokeStyle = Colors.backgroundColor.toCSS();
      context.lineWidth = 2;

      const canvasBegin: number = canvas.canvasBounds.left + positions[i] * canvas.canvasBounds.width;
      const canvasEnd: number = canvas.canvasBounds.left + positions[i + 1] * canvas.canvasBounds.width;

      context.fillRect(Math.floor(canvasBegin), canvas.canvasBounds.top, Math.ceil(canvasEnd - canvasBegin), canvas.canvasBounds.height);
      context.strokeRect(Math.floor(canvasBegin), canvas.canvasBounds.top, Math.ceil(canvasEnd - canvasBegin), canvas.canvasBounds.height);
    }

  }
}

const canvas = new Canvas('canvas');
canvas.canvasElement.style.cursor = 'pointer';
let jakobsen = new Jakobsen();
canvas.addObject(jakobsen);
let paused: boolean = true;


canvas.canvasElement.addEventListener('dblclick', reset);

function reset() {
  paused = true;
  canvas.removeOBject(jakobsen);
  jakobsen = new Jakobsen();
  canvas.addObject(jakobsen);
}

let dragStartPosition: Vector2 | undefined = undefined;
let stepsTaken: number = 0;
canvas.canvasElement.addEventListener('mousedown', (event: MouseEvent) => {
  const [x, y] = [
    event.pageX - canvas.canvasElement.offsetLeft,
    event.pageY - canvas.canvasElement.offsetTop
  ];
  pressDown(new Vector2(x, y));
});
canvas.canvasElement.addEventListener('touchstart', (event: TouchEvent) => {

  if (event.cancelable) {
    event.preventDefault();
  } else {
    return;
  }

  const [x, y] = [
    event.touches[0].pageX - canvas.canvasElement.offsetLeft,
    event.touches[0].pageY - canvas.canvasElement.offsetTop
  ];
  pressDown(new Vector2(x, y));
});
function pressDown(position: Vector2) {
  if (dragStartPosition === undefined) {
    canvas.canvasElement.style.cursor = 'move';
    dragStartPosition = new Vector2(position.x, position.y);
    stepsTaken = 0;
  }
}

canvas.canvasElement.addEventListener('mousemove', (event: MouseEvent) => {
  const [x, y] = [
    event.pageX - canvas.canvasElement.offsetLeft,
    event.pageY - canvas.canvasElement.offsetTop
  ];
  pressMove(new Vector2(x, y));
});
canvas.canvasElement.addEventListener('touchmove', (event: TouchEvent) => {
  if (event.cancelable) {
    event.preventDefault();
  } else {
    return;
  }

  const [x, y] = [
    event.touches[0].pageX - canvas.canvasElement.offsetLeft,
    event.touches[0].pageY - canvas.canvasElement.offsetTop
  ];
  pressMove(new Vector2(x, y));
});
function pressMove(position: Vector2) {
  if (dragStartPosition !== undefined) {
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
}

canvas.canvasElement.addEventListener('mouseup', pressUp);
canvas.canvasElement.addEventListener('touchend', pressUp);

let lastUpTime: number | undefined = undefined;

function pressUp() {
  if (dragStartPosition !== undefined) {
    if (stepsTaken !== 0) {
      paused = true;
    } else {
      const now: number = new Date().getTime() / 1000.0;
      if (lastUpTime !== undefined && now - lastUpTime < 0.5) {
        reset();
        lastUpTime = undefined;
        paused = true;
      } else {
        lastUpTime = now;
        paused = !paused;
      }
    }
  }
  canvas.canvasElement.style.cursor = 'pointer';
  dragStartPosition = undefined;
}

})();
