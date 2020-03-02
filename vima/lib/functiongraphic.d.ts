import BoundsSubscriber from './iboundssubscriber';
import FunctionGraphicOptions from './ifunctiongraphicoptions';
import ParametricCurveGraphic from './parametriccurvegraphic';
/**
 * Class that represents the graph of an one variable function.
 */
export default class FunctionGraphic extends ParametricCurveGraphic implements BoundsSubscriber {
    constructor(yFuncStr: string, { from, to, varStr, variables, ...others }?: FunctionGraphicOptions);
    onBoundsUpdated(bounds: paper.Rectangle): void;
    yAtX(x: number): number;
}
//# sourceMappingURL=functiongraphic.d.ts.map