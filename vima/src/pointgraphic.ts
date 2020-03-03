import * as paper from 'paper';

import * as Colors from './colors';
import { DecoratorWatchVariable } from './decoratorwatchvariable';
import { Graphic } from './graphic';
import { IPointGraphicOptions } from './ipointgraphicoptions';
import { IScreenTransformSubscriber } from './iscreentransformsubscriber';
import { Variable } from './variable';
import { WritableVariable } from './writablevariable';
import { PointGraphicType } from './pointgraphictype';
import { Vector2 } from './vector2';


/**
 * Base abstract class representing a mathematical point. Handles the the
 * visual aspects of the graphic such as color and size. The position of the
 * point is left to deriving classes.
 */
export abstract class PointGraphic extends Graphic implements IScreenTransformSubscriber {
  protected _colorVariable?: Variable<paper.Color> = undefined;
  protected _radius: number = 1;
  protected _rotation: number = 0;
  protected _screenMatrix: paper.Matrix | undefined;
  protected _positionVariable: WritableVariable<Vector2>;
  protected _interactive: boolean = true;

  public constructor({
    color = Colors.mainColor,
    radius = 10,
    type = PointGraphicType.Circle,
    interactive = true
  }: IPointGraphicOptions = {}) {
    super();

    switch (type) {
      case PointGraphicType.Circle:
        this._path = new paper.Path.Circle({
          center: new paper.Point(0.0, 0.0),
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
        throw new Error(`No path was created for type ${PointGraphicType[type]}`);
    }
    this._path.applyMatrix = false;
    this.color = color;
    this.radius = radius;
    this._positionVariable = new WritableVariable<Vector2>(new Vector2(0, 0));
    this._position = this._positionVariable;
    this.interactive = interactive;
  }

  private set interactive(interactive: boolean) {
    if (this._interactive && !interactive) {
      this._path.strokeColor = this._path.fillColor as paper.Color;
      this._path.fillColor = this._path.strokeColor.add(0.33);
      this._path.strokeWidth = 2;
    } else if (!this._interactive && interactive) {
      this._path.fillColor = this._path.strokeColor;
      this._path.strokeColor = null;
      this._path.strokeWidth = 0;
    }
    this._interactive = interactive;
  }

  @DecoratorWatchVariable
  public set color(color: paper.Color | Variable<paper.Color>) {
    if (this._interactive) {
      this._path.fillColor = color as paper.Color;
      this._path.strokeColor = null;
    } else {
      this._path.strokeColor = color as paper.Color;
      this._path.fillColor = this._path.strokeColor.add(0.33);
    }
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

    // TODO (Owlree) This method rotates the point graphic using screen
    // coordinates, but it is not clear from the name that it does so

    this._rotation = rotation * Math.PI / 180;
    this._rotation = rotation;

    // We can't rotate in screen space if we don't have a screen matrix
    if (this._screenMatrix === undefined) {
      console.warn('Could not screen rotate this object because it doesn\'t' +
        'know of the screen transform');
      return;
    }
    this._path.transform(this._screenMatrix);
    const oldRotation = this._path.rotation!;
    this._path.rotate(rotation - oldRotation);
    this._path.transform(this._screenMatrix.inverted());
  }

  public get rotation(): number {
    return this._rotation;
  }

  @DecoratorWatchVariable
  protected set _position(position: Vector2 | Variable<Vector2>) {
    const pv2: Vector2 = position as Vector2;
    this._path.position = new paper.Point(pv2.x, pv2.y);
  }

  public get position(): Vector2 {
    return this._positionVariable.value;
  }

  public set position(position: Vector2) {
    this._positionVariable.value = position;
  }

  public get positionVariable(): Variable<Vector2> {
    return this._positionVariable as Variable<Vector2>;
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
