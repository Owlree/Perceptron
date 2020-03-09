import * as paper from 'paper';

import { DecoratorWatchVariable } from './decoratorwatchvariable';
import { Graphic } from './graphic';
import { IScreenTransformSubscriber } from './iscreentransformsubscriber';
import { ITextGraphicOptions } from './itextgraphicoptions';
import { Variable } from './variable';
import { Vector2 } from './vector2';
import { Colors } from '.';


/**
 * Represents a text that can be added to {@link GraphingCalculator}, most
 * often as label.
 */
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
      content: content,
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: fontWeight,
      insert: false,
      point: [0, 0]
    });
    this.color = color;
    this.offset = offset;
    this.position = position;
  }

  /**
   * @param rotation The new rotation of the text
   */
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
    const sa: paper.Point = a.transform(this._screenMatrix);
    const sb: paper.Point = b.transform(this._screenMatrix);
    const angle: number = Math.atan2(sb.y! - sa.y!, sb.x! - sa.x!);
    this._item.rotation = angle * 180 / Math.PI;

    this._item.transform(this._screenMatrix.inverted());
  }

  /**
   * @returns The rotation of the text
   */
  public get rotation(): number {
    return this._rotation;
  }

  /**
   * @param position The new position of the text
   */
  @DecoratorWatchVariable
  public set position(position: Variable<Vector2> | Vector2) {
    const pv2: Vector2 = position as Vector2;
    this._text.position = new paper.Point(pv2.x + this._offset.x, pv2.y + this._offset.y);
  }

  /**
   * Sets the offset of the text. The final position on the canvas is calculed
   * by add the offset to the position.
   * @param offset The new offset of the text
   */
  @DecoratorWatchVariable
  public set offset(offset: Variable<Vector2> | Vector2) {
    const ov2: Vector2 = offset as Vector2;
    this._text.position =
      new paper.Point(
        this._text.position.x - this._offset.x + ov2.x,
        this._text.position.y - this._offset.y + ov2.y);
    this._offset = ov2;
  }

  /**
   * @param color The new color of the text
   */
  @DecoratorWatchVariable
  public set color(color: Variable<paper.Color> | paper.Color) {
    this._text.fillColor = color as paper.Color;
  }

  public onScreenTransformUpdated(matrix: paper.Matrix): void {
    const oldPosition: paper.Point = this._item.position!;
    this._item.transform(this._item.matrix!.inverted());

    const a: paper.Point = new paper.Point(0, 0);
    const b: paper.Point = new paper.Point(
      Math.cos(this._rotation * Math.PI / 180),
      Math.sin(this._rotation * Math.PI / 180));

    const sa: paper.Point = a.transform(matrix);
    const sb: paper.Point = b.transform(matrix);
    const angle: number = Math.atan2(sb.y! - sa.y!, sb.x! - sa.x!);
    this._item.rotation = angle * 180 / Math.PI;

    this._item.transform(matrix.inverted());
    this._screenMatrix = matrix;
    this._item.position = oldPosition;
  }
}
