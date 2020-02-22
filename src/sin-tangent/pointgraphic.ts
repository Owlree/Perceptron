import * as paper from 'paper';

import * as Colors from './colors';
import DecoratorWatchVariable from './decoratorwatchvariable';
import Graphic from './graphic';
import PointGraphicOptions from './ipointgraphicoptions';
import ScreenTransformSubscriber from './iscreentransformsubscriber';
import Variable from './variable';
import WritableVariable from './writeablevariable';


/**
 * Base abstract class representing a mathematical point. Handles the the
 * visual aspects of the graphic such as color and size. The position of the
 * point is left to deriving classes.
 */
export default abstract class PointGraphic extends Graphic implements ScreenTransformSubscriber {
  protected _colorVariable?: Variable<paper.Color> = undefined;
  protected _colorVariableChangedCallback?: ((variable: Variable<paper.Color>) => void) = undefined;
  protected _radius: number = 1;
  protected _xVariable: WritableVariable<number>;
  protected _yVariable: WritableVariable<number>;

  public constructor({
    color = Colors.mainColor,
    radius = 10
  }: PointGraphicOptions = {}) {
    super();
    this._path = new paper.Path.Circle({
      center: new paper.Point(0.7, 0.2),
      radius: radius,
      insert: false
    });
    this._path.applyMatrix = false;
    this.color = color;
    this.radius = radius;
    this._xVariable = new WritableVariable<number>(0.7);
    this._yVariable = new WritableVariable<number>(0.2);
  }

  @DecoratorWatchVariable
  public set color(color: paper.Color | Variable<paper.Color>) {
      this._path.fillColor = color as paper.Color;
  }

  public set radius(radius: number) {
    this._path.scale(1 / this._radius);
    this._path.scale(radius);
    this._radius = radius;
  }

  public get radius(): number {
    return this._radius;
  }

  public set x(x: number) {
    this._xVariable.value = x;
    this._path.position!.x = x;
  }

  public set y(y: number) {
    this._yVariable.value = y;
    this._path.position!.y = y;
  }

  public get x(): number {
    return this._xVariable.value;
  }

  public get y(): number {
    return this._yVariable.value;
  }

  public get xVariable(): Variable<number> {
    return this._xVariable as Variable<number>;
  }

  public get yVariable(): Variable<number> {
    return this._yVariable as Variable<number>;
  }

  public onScreenTransformUpdated(matrix: paper.Matrix): void {
    const oldPosition: paper.Point = this._path.position!;
    this._path.transform(this._path.matrix!.inverted());
    this._path.transform(matrix.inverted());
    this._path.position = oldPosition;
  }
}
