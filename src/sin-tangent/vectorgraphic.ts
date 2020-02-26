import * as paper from 'paper';

import * as Colors from './colors';
import DecoratorWatchVariable from './decoratorwatchvariable';
import Graphic from "./graphic";
import Variable from "./variable";
import PointGraphic from './pointgraphic';


export default class VectorGraphic extends Graphic {

  private _screenMatrix: paper.Matrix | undefined;
  private _segment: paper.Path;
  private _toPoint: PointGraphic;
  private _x1: number = 0;
  private _x2: number = 0;
  private _y1: number = 0;
  private _y2: number = 0;

  public constructor(to: PointGraphic);
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

      this._toPoint = point2;

      this._x1 = point1.x;
      this._y2 = point2.y;
      this._x2 = point2.x;
      this._y1 = point1.y;

      point1.xVariable.register((variable: Variable<number>): void => {
        this._x1 = variable.value;
        this._build();
      });

      point1.yVariable.register((variable: Variable<number>): void => {
        this._y1 = variable.value;
        this._build();
      });

      point2.xVariable.register((variable: Variable<number>): void => {
        this._x2 = variable.value;
        this._build();
      });

      point2.yVariable.register((variable: Variable<number>): void => {
        this._y2 = variable.value;
        this._build();
      });
    } else {
      this._toPoint = point1;

      point1.xVariable.register((variable: Variable<number>): void => {
        this._x2 = variable.value;
        this._build();
      });

      point1.yVariable.register((variable: Variable<number>): void => {
        this._y2 = variable.value;
        this._build();
      });

      this._x1 = this._x2 = 0;
      this._x2 = point1.x;
      this._y2 = point1.y;
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
      new paper.Segment(new paper.Point(this._x1, this._y1)),
      new paper.Segment(new paper.Point(this._x2, this._y2))
    ]);
    if (this._screenMatrix !== undefined) {
      let a = new paper.Point(this._x1, this._y1);
      let b = new paper.Point(this._x2, this._y2);
      a = this._screenMatrix.transform(a);
      b = this._screenMatrix.transform(b);
      const angle = 180 * Math.atan2(a.y! - b.y!, b.x! - a.x!) / Math.PI;
      this._toPoint.rotation = -(270 + angle);
    }
  }
}
