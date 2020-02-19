import * as paper from 'paper';

import Colors from './colors';
import CurveGraphicOptions from './icurvegraphicoptions';
import Graphic from './graphic';
import Variable from './variable';


/**
 * Abstract class for a curve graphic. Deals with all visual options. It can't
 * contain information about the actual object represented.
 */
export default abstract class CurveGraphic extends Graphic {
  protected _width: number = 0.01;
  protected _colorVariable?: Variable<paper.Color> = undefined;
  protected _colorVariableChangedCallback?: ((variable: Variable<paper.Color>) => void) = undefined;

  public constructor({
    strokeColor = Colors.mainColor,
    strokeWidth = 0.01
  }: CurveGraphicOptions = {}) {
    super();
    this._path.strokeWidth = strokeWidth;
    this.color = strokeColor;
  }

  public set color(color: paper.Color | Variable<paper.Color>) {
    if (this._colorVariable !== undefined && this._colorVariableChangedCallback !== undefined) {
      this._colorVariable.unregister(this._colorVariableChangedCallback);
      this._colorVariable = undefined;
      this._colorVariableChangedCallback = undefined;
    }
    if (color instanceof Variable) {
      this._path.strokeColor = color.value;
      this._colorVariable = color;
      this._colorVariableChangedCallback = (variable: Variable<paper.Color>): void => {
        this._path.strokeColor = variable.value;
      };
      this._colorVariable.register(this._colorVariableChangedCallback);
    } else if (color instanceof paper.Color) {
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
