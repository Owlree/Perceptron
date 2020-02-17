import * as paper from 'paper';

import CurveGraphicOptions from './curvegraphicoptions';
import Graphic from './graphic';
import Variable from './variable';


/**
 * Abstract class for a curve graphic. Deals with all visual options. It can't
 * contain information about the actual object represented.
 */
export default abstract class CurveGraphic extends Graphic {
  protected _width: number = 0.01;
  protected _colorVariable: Variable<paper.Color> | undefined = undefined;
  protected _colorVariableChangedCallback: ((variable: Variable<paper.Color>) => void) | undefined;
  constructor({
    strokeColor = new paper.Color('black'),
    strokeWidth = 0.01
  }: CurveGraphicOptions = {}) {
    super();

    // Create the path (but do not insert)
    this._path = new paper.Path({
      insert: false,
      strokeWidth: strokeWidth
    });

    this.color = strokeColor;
  }
  public set color(color: paper.Color | Variable<paper.Color>) {
    if (color instanceof Variable) {
      this._path.strokeColor = color.value;
      this._colorVariable = color;
      this._colorVariableChangedCallback = (variable: Variable<paper.Color>) => {
        this._path.strokeColor = variable.value;
      }
      this._colorVariable.register(this._colorVariableChangedCallback);
    } else if (color instanceof paper.Color) {
      if (this._colorVariable !== undefined) {
        this._colorVariable.unregister(this._colorVariableChangedCallback);
        this._colorVariableChangedCallback = undefined;
        this._colorVariable = undefined;
      }
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
