import Graphic from './graphic';
import Variable from './variable';
/**
 * A graphic calculator handles the presentation and interaction with various
 * graphics such as {@link CurveGraphic}, {@link FunctionGraphic},
 * {@link FreePointGraphic}, or others.
 */
export default class GraphingCalculator {
    private _backgroundColorVariable?;
    private _backgroundColorVariableChangedCallback?;
    private _backgroundPath;
    private _bounds;
    private readonly _graphics;
    constructor(canvasId: string);
    set bounds(bounds: paper.Rectangle);
    set backgroundColor(color: Variable<paper.Color> | paper.Color);
    add(graphic: Graphic): void;
    remove(graphic: Graphic): void;
    private setup;
}
//# sourceMappingURL=graphingcalculator.d.ts.map