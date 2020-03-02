import FreePointGraphicOptions from './ifreepointgraphicoptions';
import PointGraphic from './pointgraphic';
/**
 * Class that represents a free draggable point. Provides mouse interaction out
 * of the box.
 */
export default class FreePointGraphic extends PointGraphic {
    private _mouseDown;
    private _mouseOver;
    constructor({ x, y, ...options }?: FreePointGraphicOptions);
    private updateStyle;
}
//# sourceMappingURL=freepointgraphic.d.ts.map