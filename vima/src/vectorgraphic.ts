import * as paper from 'paper';

import * as Colors from './colors';
import { DecoratorWatchVariable } from './decoratorwatchvariable';
import { Graphic } from "./graphic";
import { Variable } from "./variable";
import { PointGraphic } from './pointgraphic';
import { Vector2 } from './vector2';


/**
 * Class that represents the graphic of a two-dimensional vector.
 */
export class VectorGraphic extends Graphic {
  private _screenMatrix: paper.Matrix | undefined;
  private _segment: paper.Path;
  private _toPoint: PointGraphic;
  private _v1: Vector2;
  private _v2: Vector2;

  public constructor(point1: PointGraphic, point2?: PointGraphic, {
    color = Colors.mainColor,
    strokeWidth = 0.01
  }: {
    color?: paper.Color | Variable<paper.Color>;
    strokeWidth?: number
  } = {}) {
    super();

    this._segment = new paper.Path({
      insert: false,
      strokeWidth: strokeWidth,
      applyMatrix: false,
      strokeColor: color,
    });

    this._group.addChild(this._segment);

    if (point2 !== undefined) { // Create a vector from point1 to point2
      this._toPoint = point2; // Keep e reference to this point to rotate it
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
    } else { // Create a vector from (0, 0) to point1
      this._toPoint = point1; // Keep e reference to this point to rotate it
      point1.positionVariable.register((variable: Variable<Vector2>): void => {
        this._v2 = variable.value;
        this._build();
      });
      this._v1 = new Vector2(0, 0);
      this._v2 = point1.position;
    }

    this._build();

    this.color = color;
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
    const a: paper.Point = new paper.Point(this._v1.x, this._v1.y);
    const b: paper.Point = new paper.Point(this._v2.x, this._v2.y);
    this._segment.removeSegments();
    this._segment.addSegments([new paper.Segment(a), new paper.Segment(b)]);
    if (this._screenMatrix !== undefined) {
      // Rotate the 'to' point to match the direction of the vector in screen
      // coordinates
      const sa: paper.Point = a.transform(this._screenMatrix);
      const sb: paper.Point = b.transform(this._screenMatrix);
      const angle: number = Math.atan2(sa.y! - sb.y!, sb.x! - sa.x!);
      this._toPoint.rotation = -(270 + angle * 180 / Math.PI);
    }
  }
}
