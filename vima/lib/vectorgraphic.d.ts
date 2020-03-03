import { Graphic } from "./graphic";
import { Variable } from "./variable";
import { PointGraphic } from './pointgraphic';
/**
 * Class that represents the graphic of a two-dimensional vector.
 */
export declare class VectorGraphic extends Graphic {
    private _screenMatrix;
    private _segment;
    private _toPoint;
    private _v1;
    private _v2;
    constructor(point1: PointGraphic, point2?: PointGraphic, { color, strokeWidth }?: {
        color?: paper.Color | Variable<paper.Color>;
        strokeWidth?: number;
    });
    set color(color: paper.Color | Variable<paper.Color>);
    onScreenTransformUpdated(matrix: paper.Matrix): void;
    private _build;
}
//# sourceMappingURL=vectorgraphic.d.ts.map