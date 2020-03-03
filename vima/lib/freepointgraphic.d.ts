import { IFreePointGraphicOptions } from './ifreepointgraphicoptions';
import { PointGraphic } from './pointgraphic';
/**
 * Class that represents a free draggable point. Provides mouse interaction out
 * of the box.
 */
export declare class FreePointGraphic extends PointGraphic {
    private _mouseDown;
    private _mouseOver;
    constructor({ x, y, ...options }?: IFreePointGraphicOptions);
    private updateStyle;
}
//# sourceMappingURL=freepointgraphic.d.ts.map