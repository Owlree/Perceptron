import { Vector2 } from "./vector2";
export declare class Rectangle {
    private readonly _topLeft;
    private readonly _bottomRight;
    constructor(topLeft: Vector2, bottomRight: Vector2);
    get topLeft(): Vector2;
    get topRight(): Vector2;
    get bottomLeft(): Vector2;
    get bottomRight(): Vector2;
    get center(): Vector2;
    get top(): number;
    get right(): number;
    get bottom(): number;
    get left(): number;
    get width(): number;
    get height(): number;
    contains(rectangle: Rectangle): boolean;
}
//# sourceMappingURL=rectangle.d.ts.map