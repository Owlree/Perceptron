import { Colors, Rectangle, Canvas, CanvasObject, Vector2 } from 'vima';

(function() {

const TRACE: boolean = false;

interface ParticleProps {
  active?: boolean;
  mass?: number;
  position: Vector2;
  velocity: Vector2;
}

class EulerParticle extends CanvasObject {

  private _active: boolean;
  private _position: Vector2;
  private _time: number = 0;
  private _velocity0: Vector2;
  private _position0: Vector2;
  private _trace: Array<Vector2>;

  constructor({active = true, position, velocity}: ParticleProps) {
    super();
    this._active = active;
    this._position0 = this._position = position;
    this._velocity0 = velocity;

    this._trace = [];
  }

  public set velocity(velocity: Vector2) {
    this._velocity0 = velocity;
  }

  public get position(): Vector2 {
    return this._position;
  }

  public activate() {
    this._active = true;
  }

  public deactivate() {
    this._active = false;
  }

  public update(dt: number, _: number): void {

    if (!this._active) return;

    this._time += dt;

    const acceleration: Vector2 = new Vector2(0, -10);

    this._position = this._position0.add(
      this._velocity0.multiply(this._time)
    ).add(
      acceleration.multiply(
        Math.pow(this._time, 2) / 2));

    if (this._position.x < -canvas.bounds.width    ||
        this._position.x > 2 * canvas.bounds.width ||
        this._position.y < -canvas.bounds.height   ||
        this._position.y > 2 * canvas.bounds.height)
    {
      canvas.removeOBject(this);
    }
  }


  public draw(context: CanvasRenderingContext2D, _: Rectangle, __: Rectangle) {
    const positionCanvas: Vector2 = this._position.coordinatesTransform(canvas.bounds, canvas.canvasBounds);

    if (!this._active) {
      const velocity: Vector2 = this._velocity0;
      const plusVelocity: Vector2 = this._position.add(velocity);
      const plusVelocityCanvas: Vector2 = plusVelocity.coordinatesTransform(canvas.bounds, canvas.canvasBounds);

      context.strokeStyle = Colors.blueColor.toCSS();
      context.lineWidth = 2;
      context.lineCap = 'round';
      context.beginPath();
      context.moveTo(positionCanvas.x, positionCanvas.y);
      context.lineTo(plusVelocityCanvas.x, plusVelocityCanvas.y);
      context.stroke();

      const velocityDirectionCanvas: Vector2 = plusVelocityCanvas.subtract(positionCanvas).normalize();
      const velocityDirectionPerpendicularCanvas: Vector2 = new Vector2(velocityDirectionCanvas.y, -velocityDirectionCanvas.x);
      const triangleP1: Vector2 = plusVelocityCanvas.add(velocityDirectionCanvas.multiply(17.3205080757));
      const triangleP2: Vector2 = plusVelocityCanvas.add(velocityDirectionPerpendicularCanvas.multiply(10));
      const triangleP3: Vector2 = plusVelocityCanvas.add(velocityDirectionPerpendicularCanvas.multiply(-10));

      context.fillStyle = Colors.blueColor.toCSS();
      context.beginPath();
      context.moveTo(plusVelocityCanvas.x, plusVelocityCanvas.y);
      context.lineTo(triangleP1.x, triangleP1.y);
      context.lineTo(triangleP2.x, triangleP2.y);
      context.lineTo(triangleP3.x, triangleP3.y);
      context.lineTo(triangleP1.x, triangleP1.y);
      context.closePath();
      context.fill();
    }

    context.fillStyle = Colors.blueColor.toCSS();
    context.beginPath();
    context.arc(positionCanvas.x, positionCanvas.y, 10, 0, 2 * Math.PI);
    context.fill();

    if (TRACE) {
      context.strokeStyle = Colors.blueColor.toCSS();
      context.lineWidth = 1;
      context.beginPath();
      for (let point of this._trace) {
        const canvasPosition: Vector2 = point.coordinatesTransform(canvas.bounds, canvas.canvasBounds);
        context.lineTo(canvasPosition.x, canvasPosition.y);
      }
      context.stroke();
    }
  }
}

const canvas: Canvas = new Canvas('canvas');

canvas.canvasElement.style.cursor = 'pointer';

function getMousePositionFromEvent(event: MouseEvent): Vector2 {
  const [x, y] = [
    event.pageX - canvas.canvasElement.offsetLeft,
    event.pageY - canvas.canvasElement.offsetTop
  ];
  return new Vector2(x, y);
}

function getTouchPositionFromEvent(event: TouchEvent): Vector2 {
  const [x, y] = [
    event.touches[0].pageX - canvas.canvasElement.offsetLeft,
    event.touches[0].pageY - canvas.canvasElement.offsetTop
  ];
  return new Vector2(x, y);
}

let newEulerParticle: EulerParticle | undefined = undefined;

canvas.canvasElement.addEventListener('mousedown', (event: MouseEvent) => {
  if (event.button !== 0) return;

  if (newEulerParticle === undefined) {
    canvas.canvasElement.style.cursor = 'move';
    const mousePositionCanvas: Vector2 = getMousePositionFromEvent(event);
    const mousePosition: Vector2 = mousePositionCanvas.coordinatesTransform(canvas.canvasBounds, canvas.bounds);
    newEulerParticle = new EulerParticle({ position: mousePosition, velocity: new Vector2(0, 0), active: false });
    canvas.addObject(newEulerParticle);
  }
});

canvas.canvasElement.addEventListener('mousemove', (event: MouseEvent) => {
  if (newEulerParticle !== undefined) {
    const mousePositionCanvas: Vector2 = getMousePositionFromEvent(event);
    const mousePosition: Vector2 = mousePositionCanvas.coordinatesTransform(canvas.canvasBounds, canvas.bounds);
    newEulerParticle.velocity = mousePosition.subtract(newEulerParticle.position);
  }
});

canvas.canvasElement.addEventListener('mouseup', (event: MouseEvent) => {

  if (event.button !== 0) return;

  canvas.canvasElement.style.cursor = 'pointer';
  if (newEulerParticle !== undefined) {
    newEulerParticle.activate();
    newEulerParticle = undefined;
  }
});

canvas.canvasElement.addEventListener('touchstart', (event: TouchEvent) => {

  if (!event.cancelable) return;
  event.preventDefault();

  if (newEulerParticle !== undefined) {
    canvas.removeOBject(newEulerParticle);
    newEulerParticle = undefined;
  }

  const mousePositionCanvas: Vector2 = getTouchPositionFromEvent(event);
  const mousePosition: Vector2 = mousePositionCanvas.coordinatesTransform(canvas.canvasBounds, canvas.bounds);

  newEulerParticle = new EulerParticle({ position: mousePosition, velocity: new Vector2(0, 0), active: false });
  canvas.addObject(newEulerParticle);
});

canvas.canvasElement.addEventListener('touchmove', (event: TouchEvent) => {

  if (!event.cancelable) return;
  event.preventDefault();

  if (newEulerParticle !== undefined) {
    const mousePositionCanvas: Vector2 = getTouchPositionFromEvent(event);
    const mousePosition: Vector2 = mousePositionCanvas.coordinatesTransform(canvas.canvasBounds, canvas.bounds);
    newEulerParticle.velocity = mousePosition.subtract(newEulerParticle.position);
  }
});

canvas.canvasElement.addEventListener('touchend', (_: TouchEvent) => {
  if (newEulerParticle !== undefined) {
    newEulerParticle.activate();
    newEulerParticle = undefined;
  }
});

})();
