import { Colors, CanvasObject, Canvas, Rectangle, Vector2 } from 'vima';


// Script scope
(function() {


class Taylortan extends CanvasObject {

  private _x: number = -1.25;
  public dx: number = 1;
  public fill: boolean = false;
  public fillError: boolean = false;

  constructor() {
    super();
  }

  public set x(x: number) {
    this._x = x;
    if (x + this.dx > canvas.bounds.right) {
      this.dx = canvas.bounds.right - x;
    } else if (x + this.dx < canvas.bounds.left) {
      this.dx = canvas.bounds.left - x;
    }
  }

  public get x(): number {
    return this._x;
  }

  public draw(context:      CanvasRenderingContext2D,
              bounds:       Rectangle,
              canvasBounds: Rectangle)
  {
    context.strokeStyle = Colors.mainColor.toCSS();
    context.lineWidth = 1;
    context.beginPath();
    for (let i = bounds.left; i <= bounds.right + 0.1; i += 0.1) {
      const point = new Vector2(i, Math.sin(i)).coordinatesTransform(bounds, canvasBounds);
      context.lineTo(point.x, point.y);
    }
    context.stroke();

    const point: Vector2 = new Vector2(this.x, Math.sin(this.x));
    const pointCanvas: Vector2 = point.coordinatesTransform(bounds, canvasBounds);

    const slope: Vector2 = new Vector2(1, Math.cos(this.x)).multiply(bounds.width);

    const t1: Vector2 = point.subtract(slope).coordinatesTransform(bounds, canvasBounds);
    const t2: Vector2 = point.add(slope).coordinatesTransform(bounds, canvasBounds);

    context.strokeStyle = Colors.blueColor.toCSS();
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(t1.x, t1.y);
    context.lineTo(t2.x, t2.y);
    context.stroke();

    if (this.fill) {
      context.fillStyle = Colors.blueColor.toCSS();
    } else {
      context.fillStyle = Colors.backgroundColor.toCSS();
    }
    context.strokeStyle = Colors.blueColor.toCSS();
    context.lineWidth = 2;
    context.beginPath();
    context.arc(pointCanvas.x, pointCanvas.y, 10, 0, 2 * Math.PI);
    context.fill();
    context.stroke();

    const p1: Vector2 = new Vector2(this.x + this.dx, Math.sin(this.x + this.dx));
    const p2: Vector2 = new Vector2(this.x + this.dx, Math.sin(this.x) + this.dx * Math.cos(this.x));
    const p1c: Vector2 = p1.coordinatesTransform(bounds, canvasBounds);
    const p2c: Vector2 = p2.coordinatesTransform(bounds, canvasBounds);

    context.strokeStyle = Colors.redColor.toCSS();
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(p1c.x, p1c.y);
    context.lineTo(p2c.x, p2c.y);
    context.stroke();

    if (this.fillError) {
      context.fillStyle = Colors.redColor.toCSS();
    } else {
      context.fillStyle = Colors.backgroundColor.toCSS();
    }
    context.strokeStyle = Colors.redColor.toCSS();
    context.lineWidth = 2;
    context.beginPath();
    context.arc(p1c.x, p1c.y, 7, 0, 2 * Math.PI);
    context.fill();
    context.stroke();

    if (this.fillError) {
      context.fillStyle = Colors.redColor.toCSS();
    } else {
      context.fillStyle = Colors.backgroundColor.toCSS();
    }
    context.strokeStyle = Colors.redColor.toCSS();
    context.lineWidth = 2;
    context.beginPath();
    context.arc(p2c.x, p2c.y, 7, 0, 2 * Math.PI);
    context.fill();
    context.stroke();

    const sign: number = p1c.y < p2c.y ? -1 : 1

    context.save();
    context.translate(p2c.x, p2c.y);
    context.rotate(-Math.atan(Math.cos(this.x)));
    context.fillStyle = Colors.mainColor.toCSS();
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.font = 'italic 19px "Latin Modern Roman"';
    context.fillText('f(t) + Δt f\'(t)', 0, -24 * sign);
    context.restore();


    context.save();
    context.translate(p1c.x, p1c.y);
    context.rotate(-Math.atan(Math.cos(p1.x)));
    context.fillStyle = Colors.mainColor.toCSS();
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.font = 'italic 19px "Latin Modern Roman"';
    context.fillText('f(t + Δt)', 0, 24 * sign);
    context.restore();

    context.shadowColor = '';
    context.shadowBlur = 0;

    if (Math.abs(pointCanvas.x - p1c.x) > 50) {
      // Draw f(x) text
      context.textBaseline = 'middle';
      context.fillStyle = Colors.mainColor.toCSS();
      context.textAlign = 'center';
      context.font = 'italic 19px "Latin Modern Roman"';
      context.fillText('f(t)', pointCanvas.x, pointCanvas.y - 30);
    }
  }

  public get point(): Vector2 {
    return new Vector2(this.x, Math.sin(this.x));
  }

  public get errorPoint1(): Vector2 {
    return new Vector2(this.x + this.dx, Math.sin(this.x + this.dx));
  }

  public get errorPoint2(): Vector2 {
    return new Vector2(this.x + this.dx, Math.sin(this.x) + this.dx * Math.cos(this.x));
  }

  public matchesError(p1: Vector2): boolean {
    const p2: Vector2 = taylortan.errorPoint1.coordinatesTransform(canvas.bounds, canvas.canvasBounds);
    const p3: Vector2 = taylortan.errorPoint2.coordinatesTransform(canvas.bounds, canvas.canvasBounds);
    return p1.distance(p2) < 10 || p1.distance(p3) < 10;
  }
}

const canvas: Canvas = new Canvas('canvas');
canvas.scale = 3;
const taylortan = new Taylortan();
canvas.addObject(taylortan);

canvas.canvasElement.addEventListener('mousemove', (event: MouseEvent) => {

  const [x, y] = [
    event.pageX - canvas.canvasElement.offsetLeft,
    event.pageY - canvas.canvasElement.offsetTop
  ];

  const p1: Vector2 = new Vector2(x, y);
  if (mouseDownMain) {
    taylortan.x = p1.coordinatesTransform(canvas.canvasBounds, canvas.bounds).x;
  } else if (mouseDownError) {
    taylortan.dx = p1.coordinatesTransform(canvas.canvasBounds, canvas.bounds).x - taylortan.x;
  } else {
    const p2: Vector2 = taylortan.point.coordinatesTransform(canvas.bounds, canvas.canvasBounds);

    if (taylortan.matchesError(p1)) {
      taylortan.fillError = true;
      taylortan.fill = false;
      document.body.style.cursor = 'grab';
    } else if (p1.distance(p2) < 10) {
      taylortan.fillError = false;
      taylortan.fill = true;
      document.body.style.cursor = 'grab';
    } else {
      taylortan.fill = false;
      taylortan.fillError = false;
      document.body.style.cursor = '';
    }
  }

});


let mouseDownMain: boolean = false;
let mouseDownError: boolean = false;

canvas.canvasElement.addEventListener('mousedown', (event: MouseEvent) => {

  const [x, y] = [
    event.pageX - canvas.canvasElement.offsetLeft,
    event.pageY - canvas.canvasElement.offsetTop
  ];

  const p1: Vector2 = new Vector2(x, y);
  const p2: Vector2 = taylortan.point.coordinatesTransform(canvas.bounds, canvas.canvasBounds);

  if (taylortan.matchesError(p1)) {
    taylortan.fill = false;
    taylortan.fillError = true;
    document.body.style.cursor = 'grabbing';
    mouseDownError = true;
  } else if (p1.distance(p2) < 10) {
    taylortan.fill = true;
    taylortan.fillError = false;
    document.body.style.cursor = 'grabbing';
    mouseDownMain = true;
  }

});

canvas.canvasElement.addEventListener('mouseup', (event: MouseEvent) => {
  mouseDownMain = false;
  mouseDownError = false;

  const [x, y] = [
    event.pageX - canvas.canvasElement.offsetLeft,
    event.pageY - canvas.canvasElement.offsetTop
  ];

  const p1: Vector2 = new Vector2(x, y);
  const p2: Vector2 = taylortan.point.coordinatesTransform(canvas.bounds, canvas.canvasBounds);

  if (p1.distance(p2) < 10) {
    taylortan.fill = true;
    taylortan.fillError = false;
    document.body.style.cursor = 'grab';
  } else if (taylortan.matchesError(p1)) {
    taylortan.fill = false;
    taylortan.fillError = true;
    document.body.style.cursor = 'grab';
  } else {
    taylortan.fill = false;
    taylortan.fillError = false;
    document.body.style.cursor = '';
  }
});

canvas.canvasElement.addEventListener('touchstart', (event: TouchEvent) => {

  if (event.cancelable) event.preventDefault();
  else return;

  const [x, y] = [
    event.touches[0].pageX - canvas.canvasElement.offsetLeft,
    event.touches[0].pageY - canvas.canvasElement.offsetTop
  ];
  const p1: Vector2 = new Vector2(x, y);

  const xb: number = p1.coordinatesTransform(canvas.canvasBounds, canvas.bounds).x;

  if ((taylortan.dx < 0 && xb < taylortan.x + taylortan.dx / 2) ||
      (taylortan.dx > 0 && xb > taylortan.x + taylortan.dx / 2))
  {
    taylortan.fill = false;
    taylortan.fillError = true;
    document.body.style.cursor = 'grabbing';
    mouseDownError = true;
  } else {
    taylortan.fill = true;
    taylortan.fillError = false;
    document.body.style.cursor = 'grabbing';
    mouseDownMain = true;
  }

});

canvas.canvasElement.addEventListener('touchmove', (event: TouchEvent) => {

  if (event.cancelable) event.preventDefault();
  else return;

  const [x, y] = [
    event.touches[0].pageX - canvas.canvasElement.offsetLeft,
    event.touches[0].pageY - canvas.canvasElement.offsetTop
  ];

  const p1: Vector2 = new Vector2(x, y);
  if (mouseDownMain) {
    taylortan.x = p1.coordinatesTransform(canvas.canvasBounds, canvas.bounds).x;
  } else if (mouseDownError) {
    taylortan.dx = p1.coordinatesTransform(canvas.canvasBounds, canvas.bounds).x - taylortan.x;
  } else {
    const p2: Vector2 = taylortan.point.coordinatesTransform(canvas.bounds, canvas.canvasBounds);

    if (p1.distance(p2) < 10) {
      taylortan.fill = true;
      document.body.style.cursor = 'grab';
    } else if (taylortan.matchesError(p1)) {
      taylortan.fillError = true;
      document.body.style.cursor = 'grab';
    } else {
      taylortan.fill = false;
      taylortan.fillError = false;
      document.body.style.cursor = '';
    }
  }

});

canvas.canvasElement.addEventListener('touchend', (_: TouchEvent) => {
  mouseDownMain = false;
  mouseDownError = false;
  taylortan.fill = taylortan.fillError = false;
});

  // function loop() {

  //   // Clear
  //   context.fillStyle = Colors.backgroundColor.value.toCSS(false);
  //   context.fillRect(0, 0, canvas.width, canvas.height);

  //   let slope = (f(x0 + 1) - f(x0 - 1)) / 2;


  //   // Draw error
  //   let dt: number = 200;
  //   context.lineWidth = 4;
  //   context.strokeStyle = 'salmon';
  //   context.beginPath();
  //   context.moveTo(x0 + dt, f(x0 + dt));
  //   context.lineTo(x0 + dt, f(x0) + slope * dt);
  //   context.stroke();

  //   context.lineWidth = 2;

  //   // Draw f
  //   context.strokeStyle = Colors.mainColor.value.toCSS(false);
  //   context.beginPath();
  //   for (let x = 0; x <= canvas.width + 10; x += 5) {
  //     context.lineTo(x, f(x));
  //   }
  //   context.stroke();

  //   // Draw tangent
  //   context.strokeStyle = 'DodgerBlue';
  //   context.beginPath();
  //   context.moveTo(x0, f(x0));
  //   context.lineTo(canvas.width, f(x0) + slope * (canvas.width - x0));
  //   context.moveTo(x0, f(x0));
  //   context.lineTo(0, f(x0) - slope * x0);
  //   context.stroke();

  //   const textDistance = 30

  //   // Draw f(x) text
  //   context.textBaseline = 'middle';
  //   context.fillStyle = Colors.mainColor.value.toCSS(false);
  //   context.textAlign = 'center';
  //   context.font = '21px "Latin Modern Roman"';
  //   context.fillText('f(t)', x0, f(x0) - textDistance);
  //   let direction = 1;
  //   if (f(x0) + dt * slope - f(x0 + dt) < 0) {
  //     direction = -1;
  //   }

  //   context.save();
  //   context.translate(x0 + dt, f(x0) + dt * slope + textDistance * direction);
  //   context.rotate(Math.atan(slope));
  //   context.fillText('f(t) + Δt f\'(t)', 0, 0);
  //   context.restore();

  //   context.save();
  //   context.translate(x0 + dt, f(x0 + dt) - textDistance * direction);
  //   context.rotate(Math.atan((f(x0 + dt + 1) - f(x0 + dt - 1)) / 2));
  //   context.fillText('f(t + Δt)', 0, 0);
  //   context.restore();

  //   // Draw dots
  //   context.beginPath();
  //   context.fillStyle = Colors.mainColor.value.toCSS(false);
  //   context.arc(x0, f(x0), 4, 0, 2 * Math.PI);
  //   context.arc(x0 + dt, f(x0) + dt * slope, 4, 0, 2 * Math.PI);
  //   context.fill();

  //   context.beginPath();
  //   context.fillStyle = Colors.mainColor.value.toCSS(false);
  //   context.arc(x0 + dt, f(x0 + dt), 4, 0, 2 * Math.PI);
  //   context.fill();

  //   window.requestAnimationFrame(loop);
  // }

  // loop();

  // End script scope
  })();