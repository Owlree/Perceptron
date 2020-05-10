import { Colors, CanvasObject, Canvas, Rectangle, Vector2 } from 'vima';


// Script scope
(function() {

class Raste extends CanvasObject {

  private p0: Vector2 = new Vector2(1, 1);
  private p1: Vector2 = new Vector2(1, -1);
  private p2: Vector2 = new Vector2(-1, 1);

  private moving: number = -1;

  private static GetPositionFromMouseEvent(e: MouseEvent) {
    const [x, y] = [
      e.pageX - canvas.canvasElement.offsetLeft,
      e.pageY - canvas.canvasElement.offsetTop
    ];
    return new Vector2(x, y).coordinatesTransform(canvas.canvasBounds, canvas.bounds);
  }

  public draw(context:      CanvasRenderingContext2D,
              _:       Rectangle,
              __: Rectangle)
  {
    for (let i = -2; i <= 2; i += 1) {
      for (let j = -1; j <= 3; j += 1) {
        if ((i + j) % 2) {
          context.fillStyle = Colors.blueColor.toCSS();
        } else {
          context.fillStyle = Colors.redColor.toCSS();
        }

        const from: Vector2 = new Vector2(i - 0.5, j - 0.5).coordinatesTransform(canvas.bounds, canvas.canvasBounds);
        const to: Vector2 = new Vector2(i + 0.5, j + 0.5).coordinatesTransform(canvas.bounds, canvas.canvasBounds);

        context.fillRect(from.x, from.y, to.x - from.x, from.y - to.y);
      }
    }

    context.beginPath();
    context.moveTo(canvas.canvasBounds.center.x, canvas.canvasBounds.top);
    context.lineTo(canvas.canvasBounds.center.x, canvas.canvasBounds.bottom);
    context.moveTo(canvas.canvasBounds.left, canvas.canvasBounds.center.y);
    context.lineTo(canvas.canvasBounds.right, canvas.canvasBounds.center.y);
    context.strokeStyle = 'yellow';
    context.stroke();

    const p0c: Vector2 = this.p0.coordinatesTransform(canvas.bounds, canvas.canvasBounds);
    const p1c: Vector2 = this.p1.coordinatesTransform(canvas.bounds, canvas.canvasBounds);
    const p2c: Vector2 = this.p2.coordinatesTransform(canvas.bounds, canvas.canvasBounds);

    context.beginPath();
    context.moveTo(p0c.x, p0c.y);
    context.lineTo(p1c.x, p1c.y);
    context.lineTo(p2c.x, p2c.y);
    context.lineTo(p0c.x, p0c.y);
    context.stroke();

    const points = [p0c, p1c, p2c];

    context.fillStyle = 'pink';
    for (let p of points) {
      context.beginPath();
      context.arc(p.x, p.y, 7, 0, 2 * Math.PI);
      context.fill();
    }
  }

  public MouseDown(e: MouseEvent) {

    if (this.moving >= 0) return;

    const p = Raste.GetPositionFromMouseEvent(e).coordinatesTransform(canvas.bounds, canvas.canvasBounds);
    const p0c = this.p0.coordinatesTransform(canvas.bounds, canvas.canvasBounds);
    const p1c = this.p1.coordinatesTransform(canvas.bounds, canvas.canvasBounds);
    const p2c = this.p2.coordinatesTransform(canvas.bounds, canvas.canvasBounds);

    if (p.distance(p0c) <= 7) {
      this.moving = 0;
    } else if (p.distance(p1c) <= 7) {
      this.moving = 1;
    } else if (p.distance(p2c) <= 7) {
      this.moving = 2;
    }

  }

  public MouseMove(e: MouseEvent) {
    if (this.moving >= 0) {

      const p = Raste.GetPositionFromMouseEvent(e);

      if (this.moving === 0) {
        this.p0 = p;
      } else if (this.moving === 1) {
        this.p1 = p;
      } else if (this.moving === 2) {
        this.p2 = p;
      }

    }
  }

  public MouseUp(_: MouseEvent) {
    this.moving = -1;
  }
}

const canvas: Canvas = new Canvas('canvas');
canvas.scale = 10;
const raste = new Raste();
canvas.addObject(raste);

canvas.canvasElement.addEventListener('mousedown', (e: MouseEvent) => {
  raste.MouseDown(e);
});

canvas.canvasElement.addEventListener('mousemove', (e: MouseEvent) => {
  raste.MouseMove(e);
});

canvas.canvasElement.addEventListener('mouseup', (e: MouseEvent) => {
  raste.MouseUp(e);
});

// End script scope
})();