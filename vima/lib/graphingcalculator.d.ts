import { Event } from './event';
import { Graphic } from './graphic';
import { IVariableListener } from './ivariablelistener';
import { MixinVariableListener } from './mixinvariablelistener';
import { Rectangle } from './rectangle';
import { Variable } from './variable';
import { Vector2 } from './vector2';
/**
 * A graphic calculator handles the presentation and interaction with various
 * graphics such as {@link CurveGraphic}, {@link FunctionGraphic},
 * {@link FreePointGraphic}, or others.
 */
declare class GraphingCalculator implements IVariableListener {
    private _bounds;
    private _mousePosition;
    private _screenMatrix;
    private readonly _backgroundPath;
    private readonly _graphics;
    constructor(canvasId: string, bounds: Rectangle);
    set bounds(bounds: Rectangle);
    /**
     * @param color The color or variable color to set as background
     */
    set backgroundColor(color: Variable<paper.Color> | paper.Color);
    /**
     * Adds a graphic to the graphing calculator
     * @param graphic The graphic to add
     */
    add(graphic: Graphic): void;
    /**
     * Removes a graphic from the graphing calculator
     * @param graphic The graphic to remove
     */
    remove(graphic: Graphic): void;
    private setup;
    on(event: string, callback: (event: Event) => void): void;
    get mousePosition(): Vector2;
    contains(position: Vector2): boolean;
    get canvas(): HTMLCanvasElement;
}
interface GraphingCalculator extends MixinVariableListener {
}
export { GraphingCalculator };
//# sourceMappingURL=graphingcalculator.d.ts.map