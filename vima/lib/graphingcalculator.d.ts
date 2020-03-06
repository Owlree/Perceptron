import { Event } from './event';
import { Graphic } from './graphic';
import { Variable } from './variable';
import { Vector2 } from './vector2';
/**
 * A graphic calculator handles the presentation and interaction with various
 * graphics such as {@link CurveGraphic}, {@link FunctionGraphic},
 * {@link FreePointGraphic}, or others.
 */
export declare class GraphingCalculator {
    private _backgroundColorVariable?;
    private _backgroundColorVariableChangedCallback?;
    private _backgroundPath;
    private _bounds;
    private readonly _graphics;
    private _mousePosition;
    private _screenMatrix;
    constructor(canvasId: string);
    set bounds(bounds: paper.Rectangle);
    set backgroundColor(color: Variable<paper.Color> | paper.Color);
    add(graphic: Graphic): void;
    remove(graphic: Graphic): void;
    private setup;
    on(event: string, callback: (event: Event) => void): void;
    get mousePosition(): Vector2;
}
//# sourceMappingURL=graphingcalculator.d.ts.map