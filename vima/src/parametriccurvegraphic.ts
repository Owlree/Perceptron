import * as math from 'mathjs';
import * as paper from 'paper';

import CurveGraphic from './curvegraphic';
import FunctionScope from './ifunctionscope';
import ParametricCurveGraphicOptions from './iparametriccurvegraphicoptions';
import Variable from './variable';
import VariablesDictionary from './ivariablesdictionary';

import MixinVariable from './mixinvariable';
import applyMixins from './applymixins';


/**
 * Class that represents a parametric curve graphic. Store data about the
 * mathematical functions that describe the curve. Visual information is store
 * in the parent class, {@link CurveGraphic}.
 */
class ParametricCurveGraphic extends CurveGraphic {

  protected _from: number = 0;
  protected _to: number = 1;
  private readonly _xfn: math.EvalFunction | undefined = undefined;
  private readonly _yfn: math.EvalFunction | undefined = undefined;
  private _varStr: string = 'x';
  private readonly _variables: VariablesDictionary = {};

  public constructor(xFuncStr: string, yFuncStr: string, {
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

    // Register self as a subscriber to changing variables
    for (let key in this._variables) {
      const variable: Variable<number> | number = this._variables[key];
      if (variable instanceof Variable) {
        // Rebuild the graphic when a variable changes value
        variable.register((): void => {
          this.build();
        });
      }
    }

    this.build();
  }

  protected getX(i: number): number {
    if (this._xfn !== undefined) {
      const scope: { [key: string]: number; } = this.getScope();
      scope[this._varStr] = i;
      return this._xfn.evaluate(scope);
    } else {
      throw new Error('Missing x coordinate function');
    }
  }

  /**
   * Computes all the points in the curve path based on {@code this._xfn} and
   * {@code this._yfn}.
   */
  protected build(): void {
    this._path.removeSegments();
    for (let i = this._from; i <= this._to; i += 0.1) {
      const point = new paper.Point(this.getX(i), this.getY(i));
      const segment = new paper.Segment(point);
      this._path.add(segment);
    }
    const point = new paper.Point(this.getX(this._to), this.getY(this._to));
    const segment = new paper.Segment(point);
    this._path.add(segment);
    this.notify();
  }

  protected getY(i: number): number {
    if (this._yfn !== undefined) {
      const scope: { [key: string]: number; } = this.getScope();
      scope[this._varStr] = i;
      return this._yfn.evaluate(scope);
    } else {
      throw new Error('Missing y coordinate function');
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
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface ParametricCurveGraphic extends MixinVariable<ParametricCurveGraphic> {}
applyMixins(ParametricCurveGraphic, [MixinVariable]);
export default ParametricCurveGraphic;
