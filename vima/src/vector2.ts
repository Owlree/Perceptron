import { Rectangle } from "./rectangle";

/**
 * A simple immutable two-dimensional vector class that can represent points,
 * directions, sizes, etc.
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

  public add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  public distance(v: Vector2): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt((dx * dx + dy * dy));
  }

  public normalize(): Vector2 {
    return this.multiply(1 / this.length());
  }

  public length(): number {
    return Math.sqrt(this.x * this.x +this.y * this.y);
  }

  public subtract(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  public interpolate(v: Vector2, r: number): Vector2 {
    return new Vector2(
      this.x * (1 - r) + v.x * r,
      this.y * (1 - r) + v.y * r
    );
  }

  public coordinatesTransform(from: Rectangle, to: Rectangle): Vector2 {
    let [x, y] = [this.x, this.y];

    x -= from.center.x;
    x /= (from.right - from.left);
    x *= (to.right - to.left);
    x += to.center.x;

    y -= from.center.y;
    y /= (from.top - from.bottom);
    y *= (to.top - to.bottom);
    y += to.center.y;

    return new Vector2(x, y);
  }

  public middle(to: Vector2): Vector2 {
    return new Vector2(
      (this.x + to.x) / 2,
      (this.y + to.y) / 2
    );
  }
}
