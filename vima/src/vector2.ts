/**
 * A simple immutable two-dimensional vector class that can represent points,
 * sizes, etc.
 */
export class Vector2 {

  // Class is immutable
  public readonly x: number;
  public readonly y: number;

  public constructor(x: number, y: number) {
    [this.x, this.y] = [x, y];
  }

  /**
   * @returns The coordinates of the vector as a plain array
   */
  public get array(): Array<number> {
    return [this.x, this.y];
  }

  /**
   * Returns a vector that is equal to the vector multiplied by the scalar.
   *
   * The object is not modified. This class is immutable.
   *
   * @param a The scalar to multiply with
   * @returns The vector multiplied by the given scalar
   */
  public multiply(a: number): Vector2 {
    return new Vector2(this.x * a, this.y * a);
  }
}
