import { Colors, Rectangle, Canvas, CanvasObject, Vector2 } from 'vima';

(function() {

const G: number = 3;
const M: number = 50;

const TRACE: boolean = true;

interface ParticleProps {
  active?: boolean;
  mass?: number;
  position: Vector2;
  velocity: Vector2;
}

class VerletParticle extends CanvasObject {

  private _active: boolean;
  private _mass: number = 1;
  private _position: Vector2;
  private _previousPosition: Vector2;
  private _trace: Array<Vector2>;

  constructor({active = true, mass = 1, position, velocity}: ParticleProps) {
    super();
    this._active = active;
    this._mass = mass;
    this._position = this._previousPosition = position;
    this.velocity = velocity;

    this._trace = [];
  }

  public set velocity(velocity: Vector2) {
    this._previousPosition = this._position.subtract(
      velocity.multiply(1 / 60));
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

  private getAcceleration(): Vector2 {

    const magnitude: number = G * this._mass * M /
      Math.pow(this._position.length(), 2);
    const direction: Vector2 = this._position.normalize().multiply(-1);

    return direction.multiply(magnitude);
  }

  public update(dt: number, _: number): void {

    if (!this._active) return;

    const position: Vector2 = this._position;
    this._position =
      this._position.multiply(2)
        .subtract(this._previousPosition)
        .add(this.getAcceleration().multiply(Math.pow(dt, 2)));
    this._previousPosition = position;

    if (TRACE) {
      this._trace.push(this._position);
      if (this._trace.length > 100) {
        this._trace.splice(0, 1);
      }
    }

    const centerCanvas: Vector2 = new Vector2(0, 0).coordinatesTransform(canvas.bounds, canvas.canvasBounds);
    const positionCanvas: Vector2 = this._position.coordinatesTransform(canvas.bounds, canvas.canvasBounds);
    if (centerCanvas.distance(positionCanvas) <= 15) {
      canvas.removeOBject(this);
    }

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
      const velocity: Vector2 = this._position.subtract(this._previousPosition).multiply(60);
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

class EulerParticle extends CanvasObject {

  private _active: boolean;
  private _mass: number = 1;
  private _position: Vector2;
  private _velocity: Vector2;
  private _trace: Array<Vector2>;

  constructor({active = true, mass = 1, position, velocity}: ParticleProps) {
    super();
    this._active = active;
    this._mass = mass;
    this._position = position;
    this._velocity = velocity;

    this._trace = [];
  }

  public set velocity(velocity: Vector2) {
    this._velocity = velocity;
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

  private getAcceleration(): Vector2 {

    const magnitude: number = G * this._mass * M /
      Math.pow(this._position.length(), 2);
    const direction: Vector2 = this._position.normalize().multiply(-1);

    return direction.multiply(magnitude);
  }

  public update(dt: number, _: number): void {

    if (!this._active) return;

    if (TRACE) {
      this._trace.push(this._position);
      if (this._trace.length > 100) {
        this._trace.splice(0, 1);
      }
    }

    const acceleration: Vector2 = this.getAcceleration();
    this._position = this._position.add(this._velocity.multiply(dt));
    this._velocity = this._velocity.add(acceleration.multiply(dt));

    const centerCanvas: Vector2 = new Vector2(0, 0).coordinatesTransform(canvas.bounds, canvas.canvasBounds);
    const positionCanvas: Vector2 = this._position.coordinatesTransform(canvas.bounds, canvas.canvasBounds);
    if (centerCanvas.distance(positionCanvas) <= 15) {
      canvas.removeOBject(this);
    }

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
      const velocity: Vector2 = this._velocity;
      const plusVelocity: Vector2 = this._position.add(velocity);
      const plusVelocityCanvas: Vector2 = plusVelocity.coordinatesTransform(canvas.bounds, canvas.canvasBounds);

      context.strokeStyle = Colors.redColor.toCSS();
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

      context.fillStyle = Colors.redColor.toCSS();
      context.beginPath();
      context.moveTo(plusVelocityCanvas.x, plusVelocityCanvas.y);
      context.lineTo(triangleP1.x, triangleP1.y);
      context.lineTo(triangleP2.x, triangleP2.y);
      context.lineTo(triangleP3.x, triangleP3.y);
      context.lineTo(triangleP1.x, triangleP1.y);
      context.closePath();
      context.fill();
    }

    context.fillStyle = Colors.redColor.toCSS();
    context.beginPath();
    context.arc(positionCanvas.x, positionCanvas.y, 10, 0, 2 * Math.PI);
    context.fill();

    if (TRACE) {
      context.strokeStyle = Colors.redColor.toCSS();
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

class Sun extends CanvasObject {
  public draw(context: CanvasRenderingContext2D, _: Rectangle, __: Rectangle) {
    const p: Vector2 = new Vector2(0, 0).coordinatesTransform(canvas.bounds, canvas.canvasBounds);
    context.fillStyle = Colors.mainColor.toCSS();
    context.beginPath();
    context.arc(p.x, p.y, 30, 0, 2 * Math.PI);
    context.fill();
    this.zIndex = 2;
  }
}

const canvas: Canvas = new Canvas('canvas');
canvas.addObject(new Sun());

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

let newVerletParticle: VerletParticle | undefined = undefined;
let newEulerParticle: EulerParticle | undefined = undefined;

canvas.canvasElement.addEventListener('mousedown', (event: MouseEvent) => {
  if (event.button !== 0) return;

  if (newVerletParticle === undefined && newEulerParticle === undefined) {
    canvas.canvasElement.style.cursor = 'move';
    const mousePositionCanvas: Vector2 = getMousePositionFromEvent(event);
    const mousePosition: Vector2 = mousePositionCanvas.coordinatesTransform(canvas.canvasBounds, canvas.bounds);
    newVerletParticle = new VerletParticle({ position: mousePosition, velocity: new Vector2(0, 0), active: false });
    canvas.addObject(newVerletParticle);
    newEulerParticle = new EulerParticle({ position: mousePosition.multiply(-1), velocity: new Vector2(0, 0), active: false });
    canvas.addObject(newEulerParticle);
  }
});

canvas.canvasElement.addEventListener('mousemove', (event: MouseEvent) => {
  if (newVerletParticle !== undefined && newEulerParticle !== undefined) {
    const mousePositionCanvas: Vector2 = getMousePositionFromEvent(event);
    const mousePosition: Vector2 = mousePositionCanvas.coordinatesTransform(canvas.canvasBounds, canvas.bounds);
    newVerletParticle.velocity = mousePosition.subtract(newVerletParticle.position);
    newEulerParticle.velocity = mousePosition.subtract(newVerletParticle.position).multiply(-1);
  }
});

canvas.canvasElement.addEventListener('mouseup', (event: MouseEvent) => {

  if (event.button !== 0) return;

  canvas.canvasElement.style.cursor = 'pointer';
  if (newVerletParticle !== undefined && newEulerParticle !== undefined) {
    newVerletParticle.activate();
    newVerletParticle = undefined;
    newEulerParticle.activate();
    newEulerParticle = undefined;
  }
});

canvas.canvasElement.addEventListener('touchstart', (event: TouchEvent) => {

  if (!event.cancelable) return;
  event.preventDefault();

  if (newVerletParticle !== undefined && newEulerParticle !== undefined) {
    canvas.removeOBject(newVerletParticle);
    canvas.removeOBject(newEulerParticle);
    newVerletParticle = newEulerParticle = undefined;
  }

  const mousePositionCanvas: Vector2 = getTouchPositionFromEvent(event);
  const mousePosition: Vector2 = mousePositionCanvas.coordinatesTransform(canvas.canvasBounds, canvas.bounds);

  newVerletParticle = new VerletParticle({ position: mousePosition, velocity: new Vector2(0, 0), active: false });
  canvas.addObject(newVerletParticle);
  newEulerParticle = new EulerParticle({ position: mousePosition.multiply(-1), velocity: new Vector2(0, 0), active: false });
  canvas.addObject(newEulerParticle);
});

canvas.canvasElement.addEventListener('touchmove', (event: TouchEvent) => {

  if (!event.cancelable) return;
  event.preventDefault();

  if (newVerletParticle !== undefined && newEulerParticle !== undefined) {
    const mousePositionCanvas: Vector2 = getTouchPositionFromEvent(event);
    const mousePosition: Vector2 = mousePositionCanvas.coordinatesTransform(canvas.canvasBounds, canvas.bounds);
    newVerletParticle.velocity = mousePosition.subtract(newVerletParticle.position);
    newEulerParticle.velocity = mousePosition.subtract(newVerletParticle.position).multiply(-1);
  }
});

canvas.canvasElement.addEventListener('touchend', (_: TouchEvent) => {
  if (newVerletParticle !== undefined && newEulerParticle !== undefined) {
    newVerletParticle.activate();
    newVerletParticle = undefined;
    newEulerParticle.activate();
    newEulerParticle = undefined;
  }
});

})();
