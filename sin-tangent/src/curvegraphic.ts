import * as paper from 'paper';

import Graphic from './graphic';


/**
 * Abstract class for a curve graphic. Deals with all visual options. It can't
 * contain information about the actual object represented.
 */
export default abstract class CurveGraphic extends Graphic {
  protected _color: paper.Color = new paper.Color('black');
  protected _width: number = 0.01;
  public set color(color: paper.Color) {
    this._color = color;
    if (this._path !== undefined) {
      this._path.strokeColor = color;
    }
  }
  public set width(width: number) {
    this._width = width;
    if (this._path !== undefined) {
      this._path.strokeWidth = width;
    }
  }
}
