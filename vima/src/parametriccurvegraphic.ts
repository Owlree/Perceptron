import * as math from 'mathjs';
import * as paper from 'paper';

import { CurveGraphic } from './curvegraphic';
import { IFunctionScope } from './ifunctionscope';
import { IParametricCurveGraphicOptions } from './iparametriccurvegraphicoptions';
import { IVariablesDictionary } from './ivariablesdictionary';
import { Variable } from './variable';

import { MixinVariable } from './mixinvariable';
import { applyMixins } from './applymixins';


/**
 * Class that represents a parametric curve graphic. Store data about the
 * mathematical functions that describe the curve. Visual information is store
 * in the parent class, {@link CurveGraphic}.
 */
class ParametricCurveGraphic extends CurveGraphic {

  protected _from: number = 0;
  protected _to: number = 1;
  private readonly _xfn: math.EvalFunction;
  private readonly _yfn: math.EvalFunction;
  private _varStr: string = 'x';
  private readonly _variables: IVariablesDictionary = {};

  public constructor(xFuncStr: string, yFuncStr: string, {
    from = 0,
    to = 1,
    variables = {},
    varStr = 'x',
    ...options
  }: IParametricCurveGraphicOptions = {}) {

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

  /**
   * Returns the x-coordinate for the given parameter
   * @param i The parameter to use
   */
  protected getX(i: number): number {
    const scope: { [key: string]: number; } = this.getScope();
    scope[this._varStr] = i;
    return this._xfn.evaluate(scope);
  }

  /**
   * Returns the y-coordinate for the given parameter
   * @param i The parameter to use
   */
  protected getY(i: number): number {
    const scope: { [key: string]: number; } = this.getScope();
    scope[this._varStr] = i;
    return this._yfn.evaluate(scope);
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

  /**
   * @returns The scope containing the current values of the all the current
   * values
   */
  private getScope(): IFunctionScope {
    let scope: IFunctionScope = {};
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
export { ParametricCurveGraphic };
