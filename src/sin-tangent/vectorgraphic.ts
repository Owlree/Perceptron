import * as paper from 'paper';

import * as Colors from './colors';
import DecoratorWatchVariable from './decoratorwatchvariable';
import Graphic from "./graphic";
import Variable from "./variable";
import PointGraphic from './pointgraphic';
import Vector2 from './vector2';


export default class VectorGraphic extends Graphic {

  private _screenMatrix: paper.Matrix | undefined;
  private _segment: paper.Path;
  private _toPoint: PointGraphic;
  private _v1: Vector2;
  private _v2: Vector2;

  public constructor(to: PointGraphic);
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  public constructor(from: PointGraphic, to: PointGraphic)
  public constructor(point1: PointGraphic, point2?: PointGraphic) {
    super();

    this._segment = new paper.Path({
      insert: false,
      strokeWidth: 0.01,
      applyMatrix: false
    });

    this._group.addChild(this._segment);

    if (point2 !== undefined) {
      // Create a vector from point1 to point2

      this._toPoint = point2; // Keep e reference to this point to rotate it

      [this._x1, this._y1] = point1.position.array;
      [this._x2, this._y2] = point2.position.array;

      this._v1 = point1.position;
      this._v2 = point2.position;

      point1.positionVariable.register((variable: Variable<Vector2>): void => {
        this._v1 = variable.value;
        this._build();
      });

      point2.positionVariable.register((variable: Variable<Vector2>): void => {
        this._v2 = variable.value;
        this._build();
      });

    } else {
      // Create a vector from (0, 0) to point1

      this._toPoint = point1; // Keep e reference to this point to rotate it

      point1.positionVariable.register((variable: Variable<Vector2>): void => {
        this._v2 = variable.value;
        this._build();
      });

      this._v1 = new Vector2(0, 0);
      this._v2 = point1.position;
    }

    this._build();

    this.color = Colors.mainColor;
    this._path.strokeWidth = 0.01;
  }

  @DecoratorWatchVariable
  public set color(color: paper.Color | Variable<paper.Color>) {
    this._segment.strokeColor = color as paper.Color;
  }

  public onScreenTransformUpdated(matrix: paper.Matrix): void {
    this._screenMatrix = matrix;
    this._build();
  }

  private _build(): void {
    this._segment.removeSegments();
    this._segment.addSegments([
      new paper.Segment(new paper.Point(this._v1.x, this._v1.y)),
      new paper.Segment(new paper.Point(this._v2.x, this._v2.y))
    ]);
    if (this._screenMatrix !== undefined) {
      let a = new paper.Point(this._v1.x, this._v1.y);
      let b = new paper.Point(this._v2.x, this._v2.y);
      a = this._screenMatrix.transform(a);
      b = this._screenMatrix.transform(b);
      const angle = 180 * Math.atan2(a.y! - b.y!, b.x! - a.x!) / Math.PI;
      this._toPoint.rotation = -(270 + angle);
    }
  }
}
