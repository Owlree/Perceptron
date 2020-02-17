import * as math from 'mathjs';

import CurveGraphic from './curvegraphic';
import FunctionScope from './functionscope';
import ParametrizedCurveGraphicOptions from './parametrizedcurvegraphicoptions';
import Variable from './variable';
import VariablesDictionary from './variablesdictionary';


/**
 * Object that represent the graph of a parametrized curve.
 */
export default class ParametrizedCurveGraphic extends CurveGraphic {

  private _xfn: math.EvalFunction | undefined = undefined;
  private _yfn: math.EvalFunction | undefined = undefined;
  private _varStr: string = 'x';
  private _variables: VariablesDictionary = {};
  protected _from: number = 0;
  protected _to: number = 1;

  private getX(i: number): number {
    if (this._xfn !== undefined) {
      const scope: { [key: string]: number; } = this.getScope();
      scope[this._varStr] = i;
      return this._xfn.evaluate(scope);
    } else {
      throw('Missing x coordinate function');
    }
  }

  private getY(i: number): number {
    if (this._yfn !== undefined) {
      const scope: { [key: string]: number; } = this.getScope();
      scope[this._varStr] = i;
      return this._yfn.evaluate(scope);
    } else {
      throw('Missing y coordinate function');
    }
  }

  constructor(xFuncStr: string, yFuncStr: string, varStr: string = 'x',
    options: ParametrizedCurveGraphicOptions = {from: 0, to: 1}) {

    super();

    // Compile math functions
    this._xfn = math.parse(xFuncStr).compile();
    this._yfn = math.parse(yFuncStr).compile();
    this._varStr = varStr;

    this._from = options.from;
    this._to = options.to;

    if (options.variables !== undefined) {
      this._variables = options.variables;
    }

    this._path = new paper.Path({
      insert: false,
      strokeColor: this._color,
      strokeWidth: this._width
    });

    // Register self as a subscribed to changing variables
    for (let key in this._variables) {
      const variable: Variable<number> | number = this._variables[key];
      if (variable instanceof Variable) {
        variable.register(() => {this.build()})
      }
    }

    this.build();
  }

  /**
   * @returns The scope containing the current values of the all the current
   * values
   */
  private getScope(): FunctionScope {
    let scope: FunctionScope = {};
    for (let key in this._variables) {
      const variable: Variable<number> | number = this._variables[key];
      if (variable instanceof Variable) {
        scope[key] = variable.value;
      } else {
        scope[key] = variable;
      }
    }
    return scope;
  }

  /**
   * Computes all the points in the curve path based on {@code this._xfn} and
   * {@code this._yfn}.
   */
  protected build() {
    this._path.removeSegments();
    for (let i = this._from; i <= this._to; i += 0.1) {
      const point = new paper.Point(this.getX(i), this.getY(i));
      const segment = new paper.Segment(point);
      this._path.add(segment);
    }
  }
}
