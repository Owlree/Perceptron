import { Graphic } from "./graphic";
import { Rectangle } from './rectangle';
import { Variable } from './variable';
/**
 * A graphic that represents a slope field
 */
export declare class SlopeField extends Graphic {
    private readonly _slopeFunction;
    private readonly _group;
    constructor(slopeFunctionStr: string, bounds: Rectangle);
    set color(color: paper.Color | Variable<paper.Color>);
}
//# sourceMappingURL=slopefieldgraphic.d.ts.map