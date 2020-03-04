import * as paper from 'paper';

import { DecoratorWatchVariable } from './decoratorwatchvariable';
import { Graphic } from './graphic';
import { IScreenTransformSubscriber } from './iscreentransformsubscriber';
import { ITextGraphicOptions } from './itextgraphicoptions';
import { Variable } from './variable';
import { Vector2 } from './vector2';
import { Colors } from '.';

export class TextGraphic extends Graphic implements IScreenTransformSubscriber {

  private _offset: Vector2 = new Vector2(0, 0);
  private _text: paper.PointText;

  protected _rotation: number = 0;
  protected _screenMatrix: paper.Matrix | undefined;

  constructor({
    color = Colors.mainColor,
    content = '',
    fontFamily,
    fontSize = 20,
    fontWeight,
    offset = new Vector2(0, 0),
    position = new Vector2(0, 0)
  }: ITextGraphicOptions = {}) {
    super();
    this._text = this._item = new paper.PointText({
      point: [0, 0],
      content: content,
      fontFamily: fontFamily,
      fontWeight: fontWeight,
      fontSize: fontSize,
      insert: false
    });
    this.color = color;
    this.offset = offset;
    this.position = position;
  }

  public set rotation(rotation: number) {
    this._rotation = rotation;
    if (this._screenMatrix === undefined) {
      console.warn('Could not screen rotate this object because it doesn\'t' +
        'know of the screen transform');
      return;
    }
    this._text.transform(this._screenMatrix);
    const a: paper.Point = new paper.Point(0, 0);
    const b: paper.Point = new paper.Point(
      Math.cos(this._rotation * Math.PI / 180),
      Math.sin(this._rotation * Math.PI / 180));
    const sa: paper.Point = a.transform(this._screenMatrix.inverted());
    const sb: paper.Point = b.transform(this._screenMatrix.inverted());
    const angle: number = Math.atan2(sb.y! - sa.y!, sb.x! - sa.x!);
    this._text.rotation = angle * 180 / Math.PI;

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

  @DecoratorWatchVariable
  public set offset(offset: Variable<Vector2> | Vector2) {
    const ov2: Vector2 = offset as Vector2;
    this._text.position =
      new paper.Point(
        this._text.position.x - this._offset.x + ov2.x,
        this._text.position.y - this._offset.y + ov2.y);
    this._offset = ov2;
  }

  @DecoratorWatchVariable
  public set color(color: Variable<paper.Color> | paper.Color) {
    this._text.fillColor = color as paper.Color;
  }

  public onScreenTransformUpdated(matrix: paper.Matrix): void {
    const oldPosition: paper.Point = this._text.position!;
    this._text.transform(this._text.matrix!.inverted());

    const a: paper.Point = new paper.Point(0, 0);
    const b: paper.Point = new paper.Point(
      Math.cos(this._rotation * Math.PI / 180),
      Math.sin(this._rotation * Math.PI / 180));

    const sa: paper.Point = a.transform(matrix.inverted());
    const sb: paper.Point = b.transform(matrix.inverted());
    const angle: number = Math.atan2(sb.y! - sa.y!, sb.x! - sa.x!);
    this._text.rotation = angle * 180 / Math.PI;

    this._text.transform(matrix.inverted());
    this._screenMatrix = matrix;
    this._text.position = oldPosition;
  }
}
