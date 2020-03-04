import * as paper from 'paper';

import { DecoratorWatchVariable } from './decoratorwatchvariable';
import { Graphic } from './graphic';
import { IScreenTransformSubscriber } from './iscreentransformsubscriber';
import { Variable } from './variable';
import { Vector2 } from './vector2';

export class TextGraphic extends Graphic implements IScreenTransformSubscriber {

  private _offset: Vector2 = new Vector2(0, 0);

  protected _rotation: number = 0;
  protected _screenMatrix: paper.Matrix | undefined;

  constructor(text: string, position: Variable<Vector2> | Vector2, offset: Vector2) {
    super();
    this._text = new paper.PointText({
      point: [0, 0],
      content: text,
      fillColor: 'black',
      fontFamily: 'Courier New',
      fontWeight: 'bold',
      fontSize: 24
    });
    this.position = position;
    this.offset = offset;
  }

  public set rotation(rotation: number) {

    // TODO (Owlree) This method rotates the point graphic using screen
    // coordinates, but it is not clear from the name that it does so

    this._rotation = rotation;
    // We can't rotate in screen space if we don't have a screen matrix
    if (this._screenMatrix === undefined) {
      console.warn('Could not screen rotate this object because it doesn\'t' +
        'know of the screen transform');
      return;
    }
    this._text.transform(this._screenMatrix);

    const a: paper.Point = new paper.Point(0, 0);
    const b: paper.Point = new paper.Point(1, Math.tan(this._rotation * Math.PI / 180));

    const sa: paper.Point = a.transform(this._screenMatrix);
    const sb: paper.Point = b.transform(this._screenMatrix);
    const angle: number = Math.atan2(sa.y! - sb.y!, sb.x! - sa.x!);
    this._text.rotation = -(angle * 180 / Math.PI);

    this._text.transform(this._screenMatrix.inverted());
  }

  public get rotation(): number {
    return this._rotation;
  }

  @DecoratorWatchVariable
  public set position(position: Variable<Vector2> | Vector2) {
    const pv2: Vector2 = position as Vector2;
    this._text.position = new paper.Point(pv2.x + this._offset.x, pv2.y + this._offset.y);
  }

  public set offset(offset: Vector2) {
    this._text.position =
      new paper.Point(
        this._text.position.x - this._offset.x + offset.x,
        this._text.position.y - this._offset.y + offset.y);
    this._offset = offset;
  }

  public onScreenTransformUpdated(matrix: paper.Matrix): void {
    const oldPosition: paper.Point = this._text.position!;
    this._text.transform(this._text.matrix!.inverted());

    const a: paper.Point = new paper.Point(0, 0);
    const b: paper.Point = new paper.Point(1, Math.tan(this._rotation * Math.PI / 180));

    const sa: paper.Point = a.transform(matrix);
    const sb: paper.Point = b.transform(matrix);
    const angle: number = Math.atan2(sa.y! - sb.y!, sb.x! - sa.x!);
    this._text.rotation = -(angle * 180 / Math.PI);

    this._text.transform(matrix.inverted());
    this._screenMatrix = matrix;
    this._text.position = oldPosition;
  }
}
