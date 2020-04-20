import { CanvasObject, Canvas, Vector2, Colors } from 'vima';


// Script scope
(function() {


class Lintra extends CanvasObject {

  private _c: number = 1;
  private _t: number = 0;

  constructor() {
    super();
  }

  public update(dt: number, _: number) {

    this._t += dt;

    if (this._t >= 3) {
      this._t -= 3;
    }

    if (this._t < 0.5) {
      this._c = (-Math.cos(2 * Math.PI * this._t) + 1) / 2;
    } else if (this._t < 1.5) {
      this._c = 1;
    } else if (this._t < 2) {
      this._c = (-Math.cos(2 * Math.PI * this._t) + 1) / 2;
    } else if (this._t < 3) {
      this._c = 0;
    }
  }

  public draw(context: CanvasRenderingContext2D) {

    const top: Vector2 = new Vector2(0, canvas.bounds.top);
    const bottom: Vector2 = new Vector2(0, canvas.bounds.bottom);
    const topC: Vector2 = top.coordinatesTransform(canvas.bounds, canvas.canvasBounds);
    const bottomC: Vector2 = bottom.coordinatesTransform(canvas.bounds, canvas.canvasBounds);
    context.lineWidth = 2;
    context.strokeStyle = Colors.mainColor.toCSS();
    context.beginPath();
    context.moveTo(topC.x, topC.y);
    context.lineTo(bottomC.x, bottomC.y);
    context.stroke();

    const left: Vector2 = new Vector2(canvas.bounds.left, 0);
    const right: Vector2 = new Vector2(canvas.bounds.right, 0);
    const leftC: Vector2 = left.coordinatesTransform(canvas.bounds, canvas.canvasBounds);
    const rightC: Vector2 = right.coordinatesTransform(canvas.bounds, canvas.canvasBounds);
    context.lineWidth = 2;
    context.strokeStyle = Colors.mainColor.toCSS();
    context.beginPath();
    context.moveTo(leftC.x, leftC.y);
    context.lineTo(rightC.x, rightC.y);
    context.stroke();

    for (let x = Math.floor(canvas.bounds.left / 2) * 2; x <= canvas.bounds.right; x += 0.25) {
      for (let y = Math.floor(canvas.bounds.bottom / 2) * 2; y <= canvas.bounds.top; y += 0.25) {

        const point0: Vector2 = new Vector2(x, y);
        const point1: Vector2 = new Vector2(
          2 * x - y,
          2 * x + 3 * y
        );
        const direction: Vector2 = point1.subtract(point0);
        const point: Vector2 = point0.add(direction.multiply(this._c));
        const pointC: Vector2 = point.coordinatesTransform(canvas.bounds, canvas.canvasBounds);

        context.fillStyle = Colors.blueColor.toCSS();
        context.beginPath();
        context.moveTo(pointC.x, pointC.y);
        context.arc(pointC.x, pointC.y, 3, 0, 2 * Math.PI);
        context.fill();
      }
    }
  }
}

const canvas: Canvas = new Canvas('canvas');
canvas.scale = 5;
const lintra = new Lintra();
canvas.addObject(lintra);

// End script scope
})();