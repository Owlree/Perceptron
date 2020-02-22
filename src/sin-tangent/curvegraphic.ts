import * as paper from 'paper';

import * as Colors from './colors';
import CurveGraphicOptions from './icurvegraphicoptions';
import DecoratorWatchVariable from './decoratorwatchvariable';
import Graphic from './graphic';
import Variable from './variable';


/**
 * Abstract class for a curve graphic. Deals with all visual options. It can't
 * contain information about the actual object represented.
 */
export default abstract class CurveGraphic extends Graphic {
  public vars: Array<Variable<number>> = [];
  protected _width: number = 0.01;
  protected _colorVariable?: Variable<paper.Color> = undefined;
  protected _colorVariableChangedCallback?:
    ((variable: Variable<paper.Color>) => void) = undefined;

  public constructor({
    strokeColor = Colors.mainColor,
    strokeWidth = 0.01
  }: CurveGraphicOptions = {}) {
    super();
    this._path.strokeWidth = strokeWidth;
    this.color = strokeColor;
  }

  @DecoratorWatchVariable
  public set color(color: paper.Color | Variable<paper.Color>) {
    this._path.strokeColor = color as paper.Color;
  }

  public set width(width: number) {
    this._width = width;
    if (this._path !== undefined) {
      this._path.strokeWidth = width;
    }
  }
}
