import { IBoundsSubscriber } from './iboundssubscriber';
import { IFunctionGraphicOptions } from './ifunctiongraphicoptions';
import { ParametricCurveGraphic } from './parametriccurvegraphic';
import { Rectangle } from './rectangle';
import { Vector2 } from './vector2';
/**
 * Class that represents the graph of an one variable function.
 */
export declare class FunctionGraphic extends ParametricCurveGraphic implements IBoundsSubscriber {
    constructor(yFuncStr: string, { from, to, varStr, variables, ...others }?: IFunctionGraphicOptions);
    onBoundsUpdated(bounds: Rectangle): void;
    /**
     * Returns the y-coordinate given the x-coordinate.
     * @param x The x coordinate
     */
    yAtX(x: number): number;
    /**
     * Returns a {@link Vector2} point at coordinates given by the x-coordinate.
     * @param x The x-coordinate
     */
    pointAtX(x: number): Vector2;
}
//# sourceMappingURL=functiongraphic.d.ts.map