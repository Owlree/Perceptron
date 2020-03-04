import { Variable } from "./variable";
import { Vector2 } from "./vector2";
export interface ITextGraphicOptions {
    color?: Variable<paper.Color> | paper.Color;
    content?: string;
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    offset?: Variable<Vector2> | Vector2;
    position?: Variable<Vector2> | Vector2;
}
//# sourceMappingURL=itextgraphicoptions.d.ts.map