
import * as mj from 'mathjs';

import { Canvas, CanvasObject, Rectangle, Color, Colors } from 'vima';

// Script scope
(function() {

const settings = {
  l: -50, r: +50,
  b: -50, t: +50,
  f: -100, n: -5
}

const segments = [{
  from: mj.matrix([0, 0,  0, 1]),
  to:   mj.matrix([0, 0, 30, 1]),
  color: new Color(0, 0, 255), // z-axis
  endpoints: true
}, {
  from: mj.matrix([0, 0,  0, 1]),
  to:   mj.matrix([0, 30, 0, 1]),
  color: new Color(0, 255, 0), // y-axis
  endpoints: true
}, {
  from: mj.matrix([0, 0,  0, 1]),
  to:   mj.matrix([30, 0, 0, 1]),
  color: new Color(255, 0, 0), // x-axis
  endpoints: true
}];

const delta = 0.5
for (let t = 0; t < 30; t += delta) {

  segments.push({

    from: mj.matrix([10 * mj.sin(t), t, 10 * mj.cos(t), 1]),
    to: mj.matrix([10 * mj.sin(t + delta), t + delta, 10 * mj.cos(t + delta), 1]),
    color: Colors.blueColor,
    endpoints: true

  });

}

interface Base {
  u: mj.Matrix;
  v: mj.Matrix;
  w: mj.Matrix;
}

class Treedee extends CanvasObject {

  private _eye: mj.Matrix    = mj.matrix([  50,  10,    50, 0.0]);
  private _viewUp: mj.Matrix = mj.matrix([ 0.0,  1.0,    0, 0.0]);

  /**
   * There does not exist a cross product for vectors with any number of
   * components other than 3 and 7. This method calculates the cross product
   * of two vectors with 4 components by ignoring the last component.
   *
   * @param u First vector of u x v
   * @param v Second vector of u x v
   *
   * @returns The cross product of u and v
   */
  private static cross(u: mj.Matrix, v: mj.Matrix): mj.Matrix {
    const xyz: mj.Index = mj.index([0, 1, 2]);

    const result: mj.Matrix = mj.cross(
      mj.subset(u, xyz),
      mj.subset(v, xyz)
    ) as mj.Matrix;
    result.resize([4]);

    return result;
  }

  /**
   * @param u A vector
   * @returns An unit vector that points in the same direction
   */
  private static normalized(u: mj.Matrix): mj.Matrix {
    return mj.multiply(u, 1 / (mj.norm(u) as number));
  }

  private static makeBase(gaze: mj.Matrix, up: mj.Matrix): Base {

    const w: mj.Matrix = mj.multiply(Treedee.normalized(gaze), -1);
    const u: mj.Matrix = Treedee.normalized(Treedee.cross(up, w));
    const v: mj.Matrix = Treedee.cross(w, u);

    return { u: u, v: v, w: w };
  }

  public update(_: number, __: number) {

    settings.l = parseInt((document.getElementById('left') as HTMLInputElement).value);
    settings.r = parseInt((document.getElementById('right') as HTMLInputElement).value);
    settings.b = parseInt((document.getElementById('bottom') as HTMLInputElement).value);
    settings.t = parseInt((document.getElementById('top') as HTMLInputElement).value);
    settings.n = parseInt((document.getElementById('near') as HTMLInputElement).value);
    settings.f = parseInt((document.getElementById('far') as HTMLInputElement).value);

    document.getElementById('vleft')!.innerText = Math.round(settings.l).toString();
    document.getElementById('vright')!.innerText = Math.round(settings.r).toString();

    document.getElementById('vbottom')!.innerText = Math.round(settings.b).toString();
    document.getElementById('vtop')!.innerText = Math.round(settings.t).toString();

    document.getElementById('vnear')!.innerText = Math.round(settings.n).toString();
    document.getElementById('vfar')!.innerText = Math.round(settings.f).toString();

    const ea = parseFloat((document.getElementById('ea') as HTMLInputElement).value);
    const er = parseInt((document.getElementById('er') as HTMLInputElement).value);
    const ey = parseInt((document.getElementById('ey') as HTMLInputElement).value);

    document.getElementById('vea')!.innerText = mj.round((ea * 180 / mj.pi)).toString();
    document.getElementById('ver')!.innerText = Math.round(er).toString();
    document.getElementById('vey')!.innerText = Math.round(ey).toString();

    this._eye = mj.matrix([ er * Math.cos(ea), ey, er * Math.sin(ea), 1. ]);
  }

  public draw(context: CanvasRenderingContext2D, _: Rectangle, __: Rectangle) {

    const w: number = canvas.canvasBounds.width;
    const h: number = canvas.canvasBounds.height;
    const { l, r, b, t, n, f } = settings;

    // Canonical cube to screen projection
    const matrixCubeToScreen = mj.matrix([
      [ w / 2,       0,    0,    (w - 1) / 2 ],
      [     0,   h / 2,    0,    (h - 1) / 2 ],
      [     0,       0,    1,              0 ],
      [     0,       0,    0,              1 ]
    ]);

    // Orthographic projection matrix
    const matrixOrtographicProjection = mj.matrix([
      [ 2 / (r - l),             0,             0,   - (r + l) / (r - l) ],
      [           0,   2 / (t - b),             0,   - (t + b) / (t - b) ],
      [           0,             0,   2 / (n - f),   - (n + f) / (n - f) ],
      [           0,             0,             0,                     1 ]
    ]);

    // Always look towards (0, 0, 0).
    const gaze: mj.Matrix = mj.multiply(this._eye, -1);
    const cameraBase = Treedee.makeBase(gaze, this._viewUp);

    const matrixCamera = mj.multiply(

      // Change of coordinates
      mj.matrix([
        cameraBase.u.toArray() as number[],
        cameraBase.v.toArray() as number[],
        cameraBase.w.toArray() as number[],
        [0, 0, 0, 1]
      ]),

      // Translation
      mj.matrix([
        [1, 0, 0, -this._eye.get([0])],
        [0, 1, 0, -this._eye.get([1])],
        [0, 0, 1, -this._eye.get([2])],
        [0, 0, 0,                   1]
      ])
    );

    // Perspective projection matrix
    const matrixPespectiveProjection = mj.matrix([
      [n, 0,     0,      0],
      [0, n,     0,      0],
      [0, 0, n + f, -f * n],
      [0, 0,     1,      0]
    ]);

    // Final 3D to 2D projection matrix
    const M = mj.multiply(
      mj.multiply(
        mj.multiply(
          matrixCubeToScreen,
          matrixOrtographicProjection),
        matrixPespectiveProjection),
      matrixCamera);


    for (let segment of segments) {

      // Multiply by the projection matrix
      let screenPositionFrom = mj.multiply(M, segment.from);
      let screenPositionTo = mj.multiply(M, segment.to);

      // Do not draw segments that are out of the canonical cube
      if (screenPositionTo.get([2])   > n || screenPositionTo.get([2])   < f ||
          screenPositionFrom.get([2]) > n || screenPositionFrom.get([2]) < f) {
        continue;
      }

      // Normalize with the 4th component
      screenPositionFrom = mj.multiply(screenPositionFrom, 1 / screenPositionFrom.get([3]));
      screenPositionTo = mj.multiply(screenPositionTo, 1 / screenPositionTo.get([3]));

      context.beginPath();
      context.strokeStyle = segment.color.toCSS();

      context.moveTo(
        screenPositionFrom.get([0]),
        canvas.canvasBounds.height - screenPositionFrom.get([1]));

      context.lineTo(
        screenPositionTo.get([0]),
        canvas.canvasBounds.height - screenPositionTo.get([1]));

      context.stroke();

      context.fillStyle = segment.color.toCSS();

      if (segment.endpoints) {
        context.beginPath();
        context.arc(
          screenPositionFrom.get([0]),
          canvas.canvasBounds.height - screenPositionFrom.get([1]),
          5, 0, 2 * Math.PI);
        context.fill();

        context.beginPath();
        context.arc(
          screenPositionTo.get([0]),
          canvas.canvasBounds.height - screenPositionTo.get([1]),
          5, 0, 2 * Math.PI);
        context.fill();
      }

    }
  }

}

const canvas: Canvas = new Canvas('canvas');
canvas.scale = 5;
const treedee = new Treedee();
canvas.addObject(treedee);

let keysPressed: number[] = [];

document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (keysPressed.indexOf(e.keyCode) < 0) {
    keysPressed.push(e.keyCode);
  }
});

document.addEventListener('keyup', (e: KeyboardEvent) => {
  keysPressed.splice(keysPressed.indexOf(e.keyCode), 1);
});

})();
