import { Colors, CanvasObject, Canvas, Rectangle, Vector2 } from 'vima';


// Script scope
(function() {

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

class Mubes extends CanvasObject {

  public s: number = 3;
  public playing: boolean = true;

  private min = 0;
  private max = 1;

  public matrix: Array<Array<number>> = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  constructor() {
    super();

    for (let i = 0; i < this.matrix.length; ++i) {
      for (let j = 0; j < this.matrix[i].length; ++j) {
        this.matrix[i][j] = Math.random();
      }
    }

    for (let t = 0; t < 10; ++t) {
      const oldMatrix: Array<Array<number>> = JSON.parse(JSON.stringify(this.matrix));

      for (let i = 0; i < this.matrix.length; ++i) {
        for (let j = 0; j < this.matrix[i].length; ++j) {

          let sum = 0;
          let els = 0;

          for (let di = -1; di <= +1; di += 1) {
            for (let dj = -1; dj <= +1; dj += 1) {
              if (0 <= i + di && i + di < this.matrix.length && 0 <= j + dj && j + dj < this.matrix[i].length) {
                sum += oldMatrix[i + di][j + dj];
                els += 1;
              }
            }
          }

          this.matrix[i][j] = sum / els;
        }
      }
    }

    this.min = 1;
    this.max = 0;

    for (let i = 0; i < this.matrix.length; ++i) {
      for (let j = 0; j < this.matrix[0].length; ++j) {
        this.min = Math.min(this.min, this.matrix[i][j]);
        this.max = Math.max(this.max, this.matrix[i][j]);
      }
    }
  }

  public update(dt: number, __: number) {
    if (this.playing) {
      this.s += dt / 10;
      if (this.s > 1) {
        this.s -= 1;
      }
    }
  }

  public draw(context: CanvasRenderingContext2D,
              _: Rectangle, __: Rectangle)
  {
    const m = this.matrix.length;
    const n = this.matrix[0].length;

    for (let i = 0; i < m; i += 1) {
      context.strokeStyle = Colors.blueColor.toCSS();
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(canvas.canvasBounds.width / (n + 1), (i + 1) * canvas.canvasBounds.height / (m + 1));
      context.lineTo(canvas.canvasBounds.width - canvas.canvasBounds.width / (n + 1), (i + 1) * canvas.canvasBounds.height / (m + 1));
      context.stroke();
    }

    for (let i = 0; i < n; i += 1) {
      context.strokeStyle = Colors.blueColor.toCSS();
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo((i + 1) * canvas.canvasBounds.width / (n + 1), canvas.canvasBounds.height / (m + 1));
      context.lineTo((i + 1) * canvas.canvasBounds.width / (n + 1), canvas.canvasBounds.height - canvas.canvasBounds.height / (m + 1));
      context.stroke();
    }

    const s = this.min + this.s * (this.max - this.min);
    const r = 4

    for (let i = 0; i < m; i += 1) {
      for (let j = 0; j < n; j += 1) {
        context.beginPath();
        context.lineWidth = 1;
        context.fillStyle = Colors.blueColor.mix(Colors.backgroundColor, 1 - this.matrix[i][j]).toCSS();
        context.strokeStyle = Colors.blueColor.toCSS();
        if (this.matrix[i][j] >= s) {
          context.fillStyle = Colors.redColor.mix(Colors.backgroundColor, 1 - this.matrix[i][j]).toCSS();
          context.strokeStyle = Colors.redColor.toCSS();
        }
        context.arc((j + 1) * canvas.canvasBounds.width / (n + 1), (i + 1) * canvas.canvasBounds.height / (m + 1), r, 0, 2 * Math.PI);
        context.fill();
        context.stroke();

        context.font = '12px monospace';
        context.fillText(this.matrix[i][j].toPrecision(3).toString(), (j + 1) * canvas.canvasBounds.width / (n + 1) + 8, (i + 1) * canvas.canvasBounds.height / (m + 1) + 15);
      }
    }

    const GetCanvasPosition = (v: Vector2): Vector2 => {
      return new Vector2(
        (v.x + 1) * canvas.canvasBounds.width / (n + 1),
        (v.y + 1) * canvas.canvasBounds.height / (m + 1)
      );
    };

    const Interpolate = (u: Vector2, v: Vector2): Vector2 => {
      const a = this.matrix[u.y][u.x];
      const b = this.matrix[v.y][v.x];
      const c = (s - a) / (b - a);
      return u.interpolate(v, c);
    }

    const Link = (a: Vector2, b: Vector2, c: Vector2, d: Vector2) => {

      const v = Interpolate(a, b);
      const w = Interpolate(c, d);

      const vc = GetCanvasPosition(v);
      const wc = GetCanvasPosition(w);

      context.strokeStyle = Colors.redColor.toCSS();
      context.beginPath();
      context.lineWidth = 4;
      context.moveTo(vc.x, vc.y);
      context.lineTo(wc.x, wc.y);
      context.stroke();

    }

    for (let i = 0; i < m - 1; i += 1) {
      for (let j = 0; j < n - 1; j += 1) {

        const a = new Vector2(j, i);
        const b = new Vector2(j + 1, i);
        const c = new Vector2(j + 1, i + 1);
        const d = new Vector2(j, i + 1);

        const am = this.matrix[a.y][a.x];
        const bm = this.matrix[b.y][b.x];
        const cm = this.matrix[c.y][c.x];
        const dm = this.matrix[d.y][d.x];

               if (am <  s && bm <  s && cm <  s && dm <  s) {
        } else if (am <  s && bm <  s && cm <  s && dm >= s) {
          Link(a, d, c, d);
        } else if (am <  s && bm <  s && cm >= s && dm <  s) {
          Link(c, d, b, c);
        } else if (am <  s && bm <  s && cm >= s && dm >= s) {
          Link(a, d, b, c);
        } else if (am <  s && bm >= s && cm <  s && dm < s) {
          Link(a, b, b, c);
        } else if (am <  s && bm >= s && cm <  s && dm >= s) {
          Link(a, b, a, d);
          Link(b, c, c, d);
        } else if (am <  s && bm >= s && cm >= s && dm <  s) {
          Link(a, b, c, d);
        } else if (am <  s && bm >= s && cm >= s && dm >= s) {
          Link(a, b, a, d);
        }


          else if (am >=  s && bm <  s && cm <  s && dm <  s) {
          Link(a, b, a, d);
        } else if (am >=  s && bm <  s && cm <  s && dm >= s) {
          Link(a, b, c, d);
        } else if (am >=  s && bm <  s && cm >= s && dm <  s) {
          Link(a, b, b, c);
          Link(a, d, c, d);
        } else if (am >=  s && bm <  s && cm >= s && dm >= s) {
          Link(a, b, b, c);
        } else if (am >=  s && bm >= s && cm <  s && dm < s) {
          Link(a, d, b, c);
        } else if (am >=  s && bm >= s && cm <  s && dm >= s) {
          Link(b, c, c, d);
        } else if (am >=  s && bm >= s && cm >= s && dm <  s) {
          Link(a, d, c, d);
        } else if (am >=  s && bm >= s && cm >= s && dm >= s) {
        }
      }
    }
  }
}

const canvas: Canvas = new Canvas('canvas');
canvas.scale = 22;
const mubes = new Mubes();
canvas.addObject(mubes);


// if (document.getElementById('sInput') !== undefined) {
//   const sInputElement: HTMLInputElement = (document.getElementById('sInput')! as HTMLInputElement);
//   mubes.s = parseFloat(sInputElement.value);
//   document.addEventListener('mousemove', () => {
//     mubes.s = parseFloat(sInputElement.value);
//   });
// }


let mouseDown = false;
let mouseDownPosition = 0;
let oldS = 0;

document.addEventListener('mousedown', (e: MouseEvent) => {
  mubes.playing = false;
  mouseDownPosition = e.pageX;
  mouseDown = true;
  oldS = mubes.s;
});

document.addEventListener('mousemove', (e: MouseEvent) => {
  if (mouseDown) {
    mubes.s = Math.min(Math.max(oldS + (e.pageX - mouseDownPosition) / canvas.canvasBounds.width, 0), 1);
  }
});

document.addEventListener('mouseup', () => {
  mouseDown = false;
});

document.addEventListener('dblclick', () => {
  mubes.playing = true;
});

const params = getParameters(window.location.href);
if ('config' in params) {
  // const _ = JSON.parse(decodeURIComponent(params['config']));
}

// End script scope
})();