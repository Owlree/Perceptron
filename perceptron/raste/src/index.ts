import { Colors, CanvasObject, Canvas, Rectangle, Vector2, Color } from 'vima';


// Script scope
(function() {

enum ColorMode {
  Triangle,
  Vertex
};

function getParameters(url: string): {[key: string]: string} {
  const params: {[key: string]: string} = {};
  const parser: HTMLAnchorElement = document.createElement('a');
  parser.href = url;
  const query: string = parser.search.substring(1);
  const vars: Array<string> = query.split('&');
  for (let v of vars) {
    var pair: Array<string> = v.split('=');
    params[pair[0]] = decodeURIComponent(pair[1]);
  }
  return params;
};

class Raste extends CanvasObject {

  private vertexSelected?: number;

  public animating: boolean = true;
  public colorMode: ColorMode = ColorMode.Vertex;
  public drawWireframe: boolean = true;
  public pixelSize: number = 1.0;
  public speed: number = 1;
  public triangles: Array<Array<number>> = [];
  public vertices: Array<Vector2> = [];

  private static GetColor(i: number) {
    const colors: Array<Color> = [
      Colors.redColor,
      Colors.blueColor,
      Colors.greenColor,
      Colors.yellowColor,
      new Color(75, 240, 255)
    ];
    return colors[i % colors.length];
  }

  /**
   * @param e A mouse event
   * @returns The coordinates of the event in canvas space
   */
  private static GetPositionFromMouseEvent(e: MouseEvent) {
    return new Vector2(
      e.pageX - canvas.canvasElement.offsetLeft,
      e.pageY - canvas.canvasElement.offsetTop);
  }

  /**
   * @param p A 2D point
   * @returns The barycentric coordinates of {@param p} with respect to the
   *          vertices of the triangle
   */
  private GetBarycentric(p: Vector2, triangle: Array<number>) {

    const f = (u: Vector2, v: Vector2, w: Vector2) => {
      return (v.y - w.y) * u.x + (w.x - v.x) * u.y + v.x * w.y - w.x * v.y;
    }

    const [p0, p1, p2] = [
      this.vertices[triangle[0]],
      this.vertices[triangle[1]],
      this.vertices[triangle[2]]
    ];

    const a: number = f(p, p1, p2) / f(p0, p1, p2);
    const b: number = f(p, p2, p0) / f(p1, p2, p0);
    const c: number = f(p, p0, p1) / f(p2, p0, p1);

    return [a, b, c];
  }

  private static Area2(a: Vector2, b: Vector2, c: Vector2) {
    return (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);
  }

  /**
   * @param a
   * @param b
   * @param u
   * @param v
   *
   * @returns Wether {@param u} and {@param v} are on the same side of the line
   *          determine by the points {@param a} and {@param b}
   */
  // private static SameSide(a: Vector2, b: Vector2, u: Vector2, v: Vector2) {
  //   const a1 = Raste.Area2(a, b, u);
  //   const a2 = Raste.Area2(a, b, v);
  //   return a1 * a2 > 0;
  // }

  private IsTopEdge(t: Array<number>, a: number, b: number) {
    return  this.vertices[t[a]].y === this.vertices[t[b]].y &&
            this.vertices[t[a]].x !== this.vertices[t[b]].x &&
            this.vertices[t[a]].y > this.vertices[t[3 - a - b]].y
  }

  private IsLeftEdge(t: Array<number>, a: number, b: number) {

    if (this.vertices[t[a]].y < this.vertices[t[b]].y) {
      [a, b] = [b, a];
    }

    const c = 3 - a - b;

    return Raste.Area2(
      this.vertices[t[a]],
      this.vertices[t[b]],
      this.vertices[t[c]]
    ) > 0 && this.vertices[t[a]].y != this.vertices[t[b]].y;
  }

  private Rasterize(context: CanvasRenderingContext2D, triangle: Array<number>) {

    for (let i = Math.floor(canvas.bounds.left); i <= Math.ceil(canvas.bounds.right); i += 1) {
      for (let j = Math.floor(canvas.bounds.bottom); j <= Math.ceil(canvas.bounds.top); j += 1) {

        const barycentric: Array<number> =
          this.GetBarycentric(new Vector2(i, j), triangle);
        const [a, b, c] = barycentric;

        let draw: boolean = false;
        draw = draw || (a > 0 && b > 0 && c > 0);

        const permutations = [
          [0, 1, 2],
          [1, 0, 2],
          [2, 0, 1]
        ];

        for (let p of permutations) {
          if (barycentric[p[0]] === 0) {
            if (this.IsTopEdge(triangle, p[1], p[2])) {
              if (0 < barycentric[p[1]] && 0 < barycentric[p[2]]) {
                draw = true;
              } else if (barycentric[p[1]] === 0) {
                draw = draw || this.IsLeftEdge(triangle, p[0], p[2]);
              } else if (barycentric[p[2]] === 0) {
                draw = draw || this.IsLeftEdge(triangle, p[0], p[1]);
              }
            } else if (this.IsLeftEdge(triangle, p[1], p[2])) {
              if (0 < barycentric[p[1]] && 0 < barycentric[p[2]]) {
                draw = true;
              } else if (barycentric[p[1]] === 0) {
                draw = draw || this.IsLeftEdge(triangle, p[0], p[2]) || this.IsTopEdge(triangle, p[0], p[2]);
              } else if (barycentric[p[2]] === 0) {
                draw = draw || this.IsLeftEdge(triangle, p[0], p[1]) || this.IsTopEdge(triangle, p[0], p[1]);
              }
            }
          }
        }

        // draw = (a > 0 && b > 0 && c > 0);

        if (draw) { // (is the point strictly inside the triangle?)

          // Coordinates of the pixel in canvas space
          const pixel: Vector2 = canvas.btc(new Vector2(i, j));

          // Coordinates of the upper left corner of the pixel in canvas space
          const from: Vector2 = canvas.btc(new Vector2(i - this.pixelSize / 2, j - this.pixelSize / 2));

          // Coordinates of the lower left corner of the pixel in canvas space
          const to: Vector2 = canvas.btc(new Vector2(i + this.pixelSize / 2, j + this.pixelSize / 2));

          const [c0, c1, c2] = [
            Raste.GetColor(triangle[0]),
            Raste.GetColor(triangle[1]),
            Raste.GetColor(triangle[2])
          ];

          let color = new Color(
            Math.floor(a * c0.red + b * c1.red + c * c2.red),
            Math.floor(a * c0.green + b * c1.green + c * c2.green),
            Math.floor(a * c0.blue + b * c1.blue + c * c2.blue)
          );

          if (this.colorMode === ColorMode.Triangle) {
            color = Raste.GetColor(this.triangles.indexOf(triangle));
          }

          let alpha = 1.0;

          if (this.drawWireframe) {
            alpha = 0.5;
          }

          // Draw the outline of the pixel
          context.strokeStyle = color.withAlpha(1).toCSS();
          context.lineWidth = 1;
          context.strokeRect(
            Math.floor(from.x), Math.floor(from.y),
            Math.ceil(to.x - from.x), Math.ceil(to.y - from.y));

          // Fill the pixel
          context.fillStyle = color.withAlpha(alpha / 2).toCSS();
          context.fillRect(
            Math.floor(from.x), Math.floor(from.y),
            Math.ceil(to.x - from.x), Math.ceil(to.y - from.y));

          // Draw a dot in the center of the pixel
          context.fillStyle = color.withAlpha(alpha).toCSS();
          context.beginPath();
          context.arc(pixel.x, pixel.y, 3, 0, 2 * Math.PI);
          context.fill();
        }
      }
    }
  }

  /**
   * @param p A point in canvas space
   * @returns The index of a vertex that is in roughly the same position as
   *          {@param p} or `undefined` is no such vertex exists
   */
  private GetVertexAtPosition(p: Vector2): number | undefined {
    for (let i = 0; i < this.vertices.length; i += 1) {
      const vertex: Vector2 = this.vertices[i];
      const vertexc: Vector2 = canvas.btc(vertex);
      if (p.distance(vertexc) <= 10) {
        canvas.canvasElement.style.cursor = 'grabbing';
        return i;
      }
    }
    return undefined;
  }

  public update(dt: number, _: number) {

    if (this.animating) {

      dt *= this.speed;

      for (let i = 0; i < this.vertices.length; i += 1) {
        const [x, y] = this.vertices[i].array;
        this.vertices[i] = new Vector2(
          x * Math.cos(dt) - y * Math.sin(dt),
          x * Math.sin(dt) + y * Math.cos(dt)
        );
      }
    }
  }

  public draw(context: CanvasRenderingContext2D,
              _: Rectangle, __: Rectangle)
  {
    for (let triangle of this.triangles) {

      this.Rasterize(context, triangle);

      if (this.drawWireframe) {

        const [p0, p1, p2] = [
          this.vertices[triangle[0]],
          this.vertices[triangle[1]],
          this.vertices[triangle[2]]
        ];

        const [p0c, p1c, p2c] = [
          canvas.btc(p0),
          canvas.btc(p1),
          canvas.btc(p2)
        ];

        const points: Array<Vector2> = [p0c, p1c, p2c];

        for (let i = 0; i < 3; i += 1) {
          for (let j = i + 1; j < 3; j += 1) {
            if (this.colorMode == ColorMode.Vertex) {
              const W = 100;
              for (let k = 1; k <= W; k += 1) {
                context.lineWidth = 2;
                if (this.colorMode === ColorMode.Vertex) {
                  context.strokeStyle = Raste.GetColor(triangle[i]).mix(
                    Raste.GetColor(triangle[j]), k / W).toCSS();
                } else if (this.colorMode === ColorMode.Triangle) {
                  context.strokeStyle =
                    Raste.GetColor(this.triangles.indexOf(triangle)).toCSS();
                }
                context.beginPath();
                context.moveTo(
                  points[i].x * (W - k + 1) / W + points[j].x * (k - 1) / W,
                  points[i].y * (W - k + 1) / W + points[j].y * (k - 1) / W);
                context.lineTo(
                  points[i].x * (W - k) / W + points[j].x * k / W,
                  points[i].y * (W - k) / W + points[j].y * k / W);
                context.stroke();
              }
            } else if (this.colorMode === ColorMode.Triangle) {

              let tris: Array<number> = [];
              for (let t = 0; t < this.triangles.length; t += 1) {
                if (this.triangles[t].indexOf(triangle[i]) > -1 && this.triangles[t].indexOf(triangle[j]) > -1) {
                  tris.push(t);
                }
              }

              const W = 10 * tris.length;

              for (let k = 0; k < 10; k += 1) {
                for (let kk = 0; kk < tris.length; kk += 1) {
                  context.strokeStyle = Raste.GetColor(tris[kk]).toCSS();
                  context.beginPath();
                  context.moveTo(
                    points[i].x * (W - (k * tris.length + kk)) / W + points[j].x * (k * tris.length + kk) / W,
                    points[i].y * (W - (k * tris.length + kk)) / W + points[j].y * (k * tris.length + kk) / W);
                  context.lineTo(
                    points[i].x * (W - (k * tris.length + kk + 1)) / W + points[j].x * (k * tris.length + kk + 1) / W,
                    points[i].y * (W - (k * tris.length + kk + 1)) / W + points[j].y * (k * tris.length + kk + 1) / W);
                  context.stroke();
                }
              }
            }
          }
        }
      }
    }

    if (this.drawWireframe) {
      for (let i = 0; i < this.vertices.length; i += 1) {
        let tris: Array<number> = [];

        for (let t = 0; t < this.triangles.length; t += 1) {
          if (this.triangles[t].indexOf(i) > -1) {
            tris.push(t);
          }
        }

        const p = canvas.btc(this.vertices[i]);
        for (let j = 0; j < tris.length; j += 1) {
          context.fillStyle = Raste.GetColor(this.colorMode === ColorMode.Triangle ? tris[j] : i).toCSS();
          context.beginPath();
          context.arc(p.x, p.y, 7, 2 * Math.PI * j / tris.length, 2 * Math.PI * (j + 1) / tris.length);
          context.lineTo(p.x, p.y);
          context.fill();
        }

        if (tris.length === 0) {
          context.strokeStyle = Colors.mainColor.toCSS();
          context.lineWidth = 2;
          context.beginPath();
          context.arc(p.x, p.y, 10, 0, 2 * Math.PI);
          if (this.vertexSelected === i) {
            context.fillStyle = Colors.mainColor.toCSS();
            context.fill();
          }
          context.stroke();
        }
      }
    }
  }

  public MouseDown(e: MouseEvent) {
    if (this.vertexSelected !== undefined) return;
    const p: Vector2 = Raste.GetPositionFromMouseEvent(e);
    this.vertexSelected = this.GetVertexAtPosition(p);
  }

  public MouseMove(e: MouseEvent) {

    const p: Vector2 = Raste.GetPositionFromMouseEvent(e);

    if (this.vertexSelected !== undefined) {
      canvas.canvasElement.style.cursor = 'grabbing';
      this.vertices[this.vertexSelected] = canvas.ctb(p);
    } else {

      const vi = this.GetVertexAtPosition(p);

      if (vi !== undefined) {
        canvas.canvasElement.style.cursor = 'grab';
      } else {
        canvas.canvasElement.style.cursor = '';
      }
    }
  }

  public MouseUp(e: MouseEvent) {
    this.vertexSelected = undefined;

    const p: Vector2 = Raste.GetPositionFromMouseEvent(e);
    const v = this.GetVertexAtPosition(p);

    if (v !== undefined) {
      canvas.canvasElement.style.cursor = 'grab';
    } else {
      canvas.canvasElement.style.cursor = '';
    }
  }
}

const canvas: Canvas = new Canvas('canvas');
canvas.scale = 20;
const raste = new Raste();
canvas.addObject(raste);

const params = getParameters(window.location.href);

if ('config' in params) {
  const config = JSON.parse(decodeURIComponent(params['config']));

  console.log(config);

  raste.animating = false;
  if ('animation' in config) {
    const animationConfig = config['animation'];
    if ('onLoad' in animationConfig) {
      if (animationConfig['onLoad'] === true) {
        raste.animating = true;
      }
    }
    if ('speed' in animationConfig) {
      if (typeof(animationConfig['speed']) === 'number') {
        raste.speed = animationConfig['speed'];
      }
    }
  }

  raste.drawWireframe = true;
  if ('wireframe' in config) {
    if (config['wireframe'] === false) {
      raste.drawWireframe = false;
    }
  }

  raste.pixelSize = 1.0;
  if ('pixelSize' in config) {
    if (typeof(config['pixelSize']) === 'number') {
      raste.pixelSize = config['pixelSize'];
    }
  }

  raste.colorMode = ColorMode.Vertex;
  if ('colorMode' in config) {
    if (config['colorMode'] === 'triangle') {
      raste.colorMode = ColorMode.Triangle;
    } else if (config['colorMode'] === 'vertex') {
      raste.colorMode = ColorMode.Vertex;
    }
  }

  if ('vertices' in config && 'triangles' in config) {
    raste.triangles = config['triangles'];
    const vertices: Array<Vector2> = [];
    for (let v of config['vertices']) {
      vertices.push(new Vector2(v[0], v[1]));
    }
    raste.vertices = vertices;
  }
}

canvas.canvasElement.addEventListener('mousedown', (e: MouseEvent) => {
  raste.animating = false;
  raste.MouseDown(e);
});

canvas.canvasElement.addEventListener('mousemove', (e: MouseEvent) => {
  raste.MouseMove(e);
});

canvas.canvasElement.addEventListener('mouseup', (e: MouseEvent) => {
  raste.MouseUp(e);
});

canvas.canvasElement.addEventListener('dblclick', (_: MouseEvent) => {
  raste.animating = true;
});

// End script scope
})();