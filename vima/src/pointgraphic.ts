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
import { Rectangle } from './rectangle';


/**
 * Base abstract class representing a mathematical point. Handles the the
 * visual aspects of the graphic such as color and size. The position of the
 * point is left to deriving classes.
 */
export abstract class PointGraphic extends Graphic implements IScreenTransformSubscriber {
  protected _interactive: boolean = true;
  protected _path: paper.Path;
  protected _positionVariable: WritableVariable<Vector2>;
  protected _radius: number = 1;
  protected _rotation: number = 0;
  protected _screenMatrix?: paper.Matrix;

  public constructor({
    color = Colors.mainColor,
    radius = 10,
    type = PointGraphicType.Circle,
    interactive = true
  }: IPointGraphicOptions = {}) {
    super();
    switch (type) {
      case PointGraphicType.Circle:
        this._item = this._path = new paper.Path.Circle({
          center: new paper.Point(0.0, 0.0),
          radius: radius,
          insert: false
        });
        break;
      case PointGraphicType.Triangle:
      {
        this._item = this._path = new paper.Path.RegularPolygon({
          insert: false,
          radius: radius,
          sides: 3
        });
        this._path.pivot = new paper.Point(0, 0);
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
    this._rotation = rotation;
    if (this._screenMatrix === undefined) {
      console.warn('Could not screen rotate this object because it doesn\'t' +
        'know of the screen transform');
      return;
    }
    this._item.transform(this._screenMatrix);
    const a: paper.Point = new paper.Point(0, 0);
    const b: paper.Point = new paper.Point(
      Math.cos(this._rotation * Math.PI / 180),
      Math.sin(this._rotation * Math.PI / 180));
    const sa: paper.Point = a.transform(this._screenMatrix.inverted());
    const sb: paper.Point = b.transform(this._screenMatrix.inverted());
    const angle: number = Math.atan2(sb.y! - sa.y!, sb.x! - sa.x!);
    this._item.rotation = angle * 180 / Math.PI;

    this._item.transform(this._screenMatrix.inverted());
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
    const oldPosition: paper.Point = this._item.position!;
    this._item.transform(this._item.matrix!.inverted());

    const a: paper.Point = new paper.Point(0, 0);
    const b: paper.Point = new paper.Point(
      Math.cos(this._rotation * Math.PI / 180),
      Math.sin(this._rotation * Math.PI / 180));

    const sa: paper.Point = a.transform(matrix.inverted());
    const sb: paper.Point = b.transform(matrix.inverted());
    const angle: number = Math.atan2(sb.y! - sa.y!, sb.x! - sa.x!);
    this._item.rotation = angle * 180 / Math.PI;

    this._item.transform(matrix.inverted());
    this._screenMatrix = matrix;
    this._item.position = oldPosition;
  }

  public get bounds(): Rectangle {
    return new Rectangle(
      new Vector2(this._item.bounds.bottomLeft.x, this._item.bounds.bottomLeft.y),
      new Vector2(this._item.bounds.topRight.x, this._item.bounds.topRight.y),
    );
  }
}
