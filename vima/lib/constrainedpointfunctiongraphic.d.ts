import ConstrainedPointFunctionGraphicOptions from './iconstrainedpointfunctiongraphicoptions';
import FunctionGraphic from './functiongraphic';
import PointGrahic from './pointgraphic';
/**
 * Class that represents a point constrained to move along a
 * {@link FunctionGraphic}. Provides mouse interaction out of the
 * box. When the point is dragged, the abscissa of the mouse position is used
 * as input to the function to get the ordinate.
 */
export default class ConstrainedPointFunctionGraphic extends PointGrahic {
    private _mouseDown;
    private _mouseOver;
    private readonly _functionGraphic;
    constructor(functionGraphic: FunctionGraphic, { x, interactive, ...options }?: ConstrainedPointFunctionGraphicOptions);
    private set x(value);
    private updateStyle;
}
//# sourceMappingURL=constrainedpointfunctiongraphic.d.ts.map