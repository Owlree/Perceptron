import { Vector2 } from "./vector2";
/**
 * A simple rectangle class.
 */
export declare class Rectangle {
    private readonly _topLeft;
    private readonly _bottomRight;
    constructor(topLeft: Vector2, bottomRight: Vector2);
    /**
     * @returns The top left corner of the rectangle.
     */
    get topLeft(): Vector2;
    /**
     * @returns The top right corner of the rectangle.
     */
    get topRight(): Vector2;
    /**
     * @returns The bottom left corner of the rectangle.
     */
    get bottomLeft(): Vector2;
    /**
     * @returns The bottom right corner of the rectangle.
     */
    get bottomRight(): Vector2;
    /**
     * @returns The center of the rectangle.
     */
    get center(): Vector2;
    /**
     * @returns The top y-coordinate of the rectangle.
     */
    get top(): number;
    /**
     * @returns The rigth x-coordinate of the rectangle.
     */
    get right(): number;
    /**
     * @returns The bottom y-coordinate of the rectangle.
     */
    get bottom(): number;
    /**
     * @returns The left x-coordinate of the rectangle.
     */
    get left(): number;
    /**
     * @returns The width of the rectangle (x-coordinate size).
     */
    get width(): number;
    /**
     * @returns The heighto f the rectangle (y-coordinate size).
     */
    get height(): number;
    /**
     * @param rectangle A rectangle
     * @returns Wether the given rectangle is contained in this rectangle.
     */
    contains(rectangle: Rectangle): boolean;
}
//# sourceMappingURL=rectangle.d.ts.map