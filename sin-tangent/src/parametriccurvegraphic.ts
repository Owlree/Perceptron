import * as math from 'mathjs';
import * as paper from 'paper';

import CurveGraphic from './curvegraphic';
import FunctionScope from './functionscope';
import ParametricCurveGraphicOptions from './parametriccurvegraphicoptions';
import Variable from './variable';
import VariablesDictionary from './variablesdictionary';

// TODO (Owlree) change 'parametrized' to 'parametric'

/**
 * Object that represent the graph of a parametrized curve.
 */
export default class ParametricCurveGraphic extends CurveGraphic {

  private _xfn: math.EvalFunction | undefined = undefined;
  private _yfn: math.EvalFunction | undefined = undefined;
  private _varStr: string = 'x';
  private _variables: VariablesDictionary = {};
  protected _from: number = 0;
  protected _to: number = 1;

  constructor(xFuncStr: string, yFuncStr: string, {
    from = 0,
    to = 1,
    variables = {},
    varStr = 'x',
    ...options
  }: ParametricCurveGraphicOptions = {}) {

    super(options);

    // Compile math functions
    this._xfn = math.parse(xFuncStr).compile();
    this._yfn = math.parse(yFuncStr).compile();

    // Set necessary options
    [this._varStr, this._from, this._to, this._variables] =
      [varStr, from, to, variables];

    // Register self as a subscribed to changing variables
    for (let key in this._variables) {
      const variable: Variable<number> | number = this._variables[key];
      if (variable instanceof Variable) {
        variable.register(() => {this.build()})
      }
    }

    this.build();
  }

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
