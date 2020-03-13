import { Graphic } from "./graphic";
import { Rectangle } from './rectangle';
import { Variable } from './variable';
import { Vector2 } from './vector2';
/**
 * A graphic that represents a slope field
 */
export declare class SlopeField extends Graphic {
    private readonly _slopeFunction;
    private readonly _group;
    private readonly _solution;
    constructor(slopeFunctionStr: string, bounds: Rectangle);
    set solutionPosition(position_: Vector2 | Variable<Vector2>);
    set color(color: paper.Color | Variable<paper.Color>);
}
//# sourceMappingURL=slopefieldgraphic.d.ts.map