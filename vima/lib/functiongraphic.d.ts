import { IBoundsSubscriber } from './iboundssubscriber';
import { IFunctionGraphicOptions } from './ifunctiongraphicoptions';
import { ParametricCurveGraphic } from './parametriccurvegraphic';
/**
 * Class that represents the graph of an one variable function.
 */
export declare class FunctionGraphic extends ParametricCurveGraphic implements IBoundsSubscriber {
    constructor(yFuncStr: string, { from, to, varStr, variables, ...others }?: IFunctionGraphicOptions);
    onBoundsUpdated(bounds: paper.Rectangle): void;
    yAtX(x: number): number;
}
//# sourceMappingURL=functiongraphic.d.ts.map