import { CurveGraphic } from './curvegraphic';
import { IParametricCurveGraphicOptions } from './iparametriccurvegraphicoptions';
import { MixinVariable } from './mixinvariable';
/**
 * Class that represents a parametric curve graphic. Store data about the
 * mathematical functions that describe the curve. Visual information is store
 * in the parent class, {@link CurveGraphic}.
 */
declare class ParametricCurveGraphic extends CurveGraphic {
    protected _from: number;
    protected _to: number;
    private readonly _xfn;
    private readonly _yfn;
    private _varStr;
    private readonly _variables;
    constructor(xFuncStr: string, yFuncStr: string, { from, to, variables, varStr, ...options }?: IParametricCurveGraphicOptions);
    protected getX(i: number): number;
    /**
     * Computes all the points in the curve path based on {@code this._xfn} and
     * {@code this._yfn}.
     */
    protected build(): void;
    protected getY(i: number): number;
    /**
     * @returns The scope containing the current values of the all the current
     * values
     */
    private getScope;
}
interface ParametricCurveGraphic extends MixinVariable<ParametricCurveGraphic> {
}
export { ParametricCurveGraphic };
//# sourceMappingURL=parametriccurvegraphic.d.ts.map