import { Color, Colors, CanvasObject, Rectangle, Canvas, Vector2 } from 'vima';

// Script scope
(function() {

class Jakobsen extends CanvasObject {

  private _timeElapsed: number;
  private _desiredSegmentLength: number;
  private _states: Array<{
    positions: Array<Vector2>;
    segment: number;
    steps: number;
  }>;

  constructor() {
    super();

    const positions: Array<Vector2> = [];
    this._desiredSegmentLength = 0.1 / 3;
    this._timeElapsed = 0;

    for (let i = -0.4; i < 0; i += 0.1) {
      positions.push(new Vector2(i, 0));
    }
    positions.push(new Vector2(0, 0));

    for (let i = 0; i < 0.4; i += 0.1) {
      positions.push(new Vector2(0, i));
    }
    positions.push(new Vector2(0, 0.4));

    for (let i = 0; i < 0.4; i += 0.1) {
      positions.push(new Vector2(i, 0.4));
    }
    positions.push(new Vector2(0.4, 0.4));

    for (let i = 0.4; i > 0.0; i -= 0.1) {
      positions.push(new Vector2(0.4, i));
    }
    positions.push(new Vector2(0.4, 0));

    for (let i = 0.4; i < 0.8; i += 0.1) {
      positions.push(new Vector2(i, 0));
    }

    for (let i = 0; i < positions.length; ++i) {
      positions[i] = new Vector2(positions[i].x - 0.2, positions[i].y - 0.2);
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
    positions: Array<Vector2>;
    segment: number;
    steps: number;
  }): {
    positions: Array<Vector2>;
    segment: number;
    steps: number;
  } {
    const newPositions: Array<Vector2> = [];
    for (let p of positions) {
      newPositions.push(p);
    }
    const i: number = segment;
    const difference: number = newPositions[i + 1].distance(newPositions[i]) - this._desiredSegmentLength;
    const direction: Vector2 = newPositions[i + 1].subtract(newPositions[i]).normalize();
    newPositions[i] = newPositions[i].add(direction.multiply(difference / 2));
    newPositions[i + 1] = newPositions[i + 1].subtract(direction.multiply(difference / 2));

    return {
      positions: newPositions,
      segment: (segment + 1) % (positions.length - 1),
      steps: steps + 1
    };
  }

  public update(dt: number, _: number) {
    if (paused || dragStartPosition !== undefined) {
      this._timeElapsed = this._states.length * 0.1;
      return;
    }
    this._timeElapsed += dt;
    while (this._timeElapsed / 0.1 > this._states.length) {
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
      context.beginPath();
      const segmentLength: number = positions[i + 1].distance(positions[i]);
      const percentage: number = (segmentLength - this._desiredSegmentLength) / (0.1 - this._desiredSegmentLength);
      const color: Color = Colors.blueColor.mix(Colors.redColor, percentage);
      context.strokeStyle = color.toCSS();
      context.lineWidth = 5;
      context.lineCap = 'round';

      const p1: Vector2 = positions[i].coordinatesTransform(canvas.bounds, canvas.canvasBounds);
      const p2: Vector2 = positions[i + 1].coordinatesTransform(canvas.bounds, canvas.canvasBounds);

      context.moveTo(p1.x, p1.y);
      context.lineTo(p2.x, p2.y);
      context.stroke();
    }

  }
}

const canvas = new Canvas('canvas');
canvas.scale = 0.8;
canvas.canvasElement.style.cursor = 'pointer';
let jakobsen = new Jakobsen();
canvas.addObject(jakobsen);
let paused: boolean = true;


canvas.canvasElement.addEventListener('dblclick', (_: MouseEvent) => {
  paused = true;
  canvas.removeOBject(jakobsen);
  jakobsen = new Jakobsen();
  canvas.addObject(jakobsen);
});

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

function pressUp() {
  if (dragStartPosition !== undefined) {
    if (stepsTaken !== 0) {
      paused = true;
    } else {
      paused = !paused;
    }
  }
  canvas.canvasElement.style.cursor = 'pointer';
  dragStartPosition = undefined;
}

})();
