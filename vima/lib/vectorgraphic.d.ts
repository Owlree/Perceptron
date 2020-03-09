import { Graphic } from "./graphic";
import { Variable } from "./variable";
import { PointGraphic } from './pointgraphic';
import { Vector2 } from './vector2';
/**
 * Class that represents the graphic of a two-dimensional vector.
 */
export declare class VectorGraphic extends Graphic {
    private _group;
    private _screenMatrix;
    private _segment;
    private _toPoint;
    private _v1;
    private _v2;
    constructor(point1: PointGraphic, point2?: PointGraphic, { color, strokeWidth }?: {
        color?: paper.Color | Variable<paper.Color>;
        strokeWidth?: number;
    });
    /**
     * @param color The new color of the vector
     */
    set color(color: paper.Color | Variable<paper.Color>);
    onScreenTransformUpdated(matrix: paper.Matrix): void;
    private _build;
    /**
     * @returns The vector value represented by the graphic
     */
    get vector2(): Vector2;
}
//# sourceMappingURL=vectorgraphic.d.ts.map