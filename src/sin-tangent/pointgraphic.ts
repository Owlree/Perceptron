import * as paper from 'paper';

import * as Colors from './colors';
import DecoratorWatchVariable from './decoratorwatchvariable';
import Graphic from './graphic';
import PointGraphicOptions from './ipointgraphicoptions';
import ScreenTransformSubscriber from './iscreentransformsubscriber';
import Variable from './variable';
import WritableVariable from './writeablevariable';
import PointGraphicType from './pointgraphictype';


/**
 * Base abstract class representing a mathematical point. Handles the the
 * visual aspects of the graphic such as color and size. The position of the
 * point is left to deriving classes.
 */
export default abstract class PointGraphic extends Graphic implements ScreenTransformSubscriber {
  protected _colorVariable?: Variable<paper.Color> = undefined;
  protected _colorVariableChangedCallback?: ((variable: Variable<paper.Color>) => void) = undefined;
  protected _radius: number = 1;
  protected _rotation: number = 0;
  protected _xVariable: WritableVariable<number>;
  protected _yVariable: WritableVariable<number>;
  protected _screenMatrix: paper.Matrix | undefined;

  public constructor({
    color = Colors.mainColor,
    radius = 10,
    type = PointGraphicType.Circle
  }: PointGraphicOptions = {}) {
    super();

    switch (type) {
      case PointGraphicType.Circle:
        this._path = new paper.Path.Circle({
          center: new paper.Point(0.7, 0.2),
          radius: radius,
          insert: false
        });
        break;
      case PointGraphicType.Triangle:
      {
        this._path.removeSegments();
        // Here we create an equalateral triangle by hand because paper creates
        // a triangle with the center that is off the origin
        // TODO (Owlree) Double check if paper is actually faulty in this case
        const trianglePath = new paper.Path.RegularPolygon({
          insert: false,
          radius: radius,
          sides: 3
        });
        this._path.transform(this._path.matrix!.inverted());
        // const height: number = 3 / 2 * radius;
        // const side: number = 2 * Math.sqrt(3) / 3 * height;
        this._path.addSegments(trianglePath.segments!);
        this._path.pivot = new paper.Point(0, 0);
        this._path.closePath();
        break;
      }
      default:
        // TODO (Owlree) Isn't there a better way to handle this case in TS?
        throw new Error(`No path was created for type ${type}`);
    }
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

  public set rotation(rotation: number) {

    // TODO (Owlree) This code needs refactoring; it is highly duplicated with
    // the code for the code in the screen transform update method

    // TODO (Owlree) This method rotates the point graphic using screen
    // coordinates, but it is not clear from the name that it does so

    this._rotation = rotation * Math.PI / 180;

    // We can't rotate in screen space if we don't have a screen matrix
    if (this._screenMatrix === undefined) return;

    const oldPosition: paper.Point = this._path.position!;
    this._path.transform(this._path.matrix!.inverted());
    const rotationMatrix = new paper.Matrix(
      Math.cos(this._rotation), -Math.sin(this._rotation),
      -Math.sin(this._rotation), -Math.cos(this._rotation),
      0, 0);
    this._path.transform(rotationMatrix);
    this._path.transform(this._screenMatrix.inverted());
    this._path.position = oldPosition;
  }

  public get rotation(): number {
    return this._rotation;
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
    this._screenMatrix = matrix;

    const oldPosition: paper.Point = this._path.position!;
    this._path.transform(this._path.matrix!.inverted());

    // TODO (Owlree) Rotation matrix code duplication, see the rotation setter
    const rotationMatrix = new paper.Matrix(
      Math.cos(this._rotation), -Math.sin(this._rotation),
      -Math.sin(this._rotation), -Math.cos(this._rotation),
      0, 0);

    this._path.transform(rotationMatrix);
    this._path.transform(this._screenMatrix.inverted());
    this._path.position = oldPosition;
  }
}
