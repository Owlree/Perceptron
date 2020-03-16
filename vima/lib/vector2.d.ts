/**
 * A simple immutable two-dimensional vector class that can represent points,
 * sizes, etc.
 */
export declare class Vector2 {
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number);
    /**
     * @returns The coordinates of the vector as a plain array
     */
    get array(): Array<number>;
    /**
     * Returns a vector that is equal to the vector multiplied by the scalar.
     *
     * The object is not modified. This class is immutable.
     *
     * @param a The scalar to multiply with
     * @returns The vector multiplied by the given scalar
     */
    multiply(a: number): Vector2;
    add(v: Vector2): Vector2;
    distance(v: Vector2): number;
    normalize(): Vector2;
    subtract(v: Vector2): Vector2;
}
//# sourceMappingURL=vector2.d.ts.map