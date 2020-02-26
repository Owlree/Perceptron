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
        const trianglePath = new paper.Path.RegularPolygon({
          insert: false,
          radius: radius,
          sides: 3
        });
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
    this._rotation = rotation;

    // We can't rotate in screen space if we don't have a screen matrix
    if (this._screenMatrix === undefined) {
      console.warn('Could not screen rotate this object because it doesn\'t' +
        'know of the screen transform');
      return;
    };
    this._path.transform(this._screenMatrix);
    const oldRotation = this._path.rotation!;
    this._path.rotate(rotation - oldRotation);
    this._path.transform(this._screenMatrix.inverted());
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
    const oldPosition: paper.Point = this._path.position!;
    this._path.transform(this._path.matrix!.inverted());
    this._path.rotate(this._rotation);
    this._path.transform(matrix.inverted());
    this._screenMatrix = matrix;
    this._path.position = oldPosition;
  }
}
