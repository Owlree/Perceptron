import { Vector2 } from "./vector2";


/**
 * A simple rectangle class.
 */
export class Rectangle {
  private readonly _topLeft: Vector2;
  private readonly _bottomRight: Vector2;

  constructor(topLeft: Vector2, bottomRight: Vector2) {
    this._topLeft = topLeft;
    this._bottomRight = bottomRight;
  }

  /**
   * @returns The top left corner of the rectangle.
   */
  public get topLeft(): Vector2 {
    return this._topLeft;
  }

  /**
   * @returns The top right corner of the rectangle.
   */
  public get topRight(): Vector2 {
    return new Vector2(this._bottomRight.x, this._topLeft.y);
  }

  /**
   * @returns The bottom left corner of the rectangle.
   */
  public get bottomLeft(): Vector2 {
    return new Vector2(this._topLeft.x, this._bottomRight.y);
  }

  /**
   * @returns The bottom right corner of the rectangle.
   */
  public get bottomRight(): Vector2 {
    return this._bottomRight
  }

  /**
   * @returns The center of the rectangle.
   */
  public get center(): Vector2 {
    return new Vector2(
      (this._topLeft.x + this._bottomRight.x) / 2,
      (this._topLeft.y + this._bottomRight.y) / 2
    );
  }

  /**
   * @returns The top y-coordinate of the rectangle.
   */
  public get top(): number {
    return this._topLeft.y;
  }

  /**
   * @returns The rigth x-coordinate of the rectangle.
   */
  public get right(): number {
    return this._bottomRight.x;
  }

  /**
   * @returns The bottom y-coordinate of the rectangle.
   */
  public get bottom(): number {
    return this._bottomRight.y;
  }

  /**
   * @returns The left x-coordinate of the rectangle.
   */
  public get left(): number {
    return this._topLeft.x;
  }

  /**
   * @returns The width of the rectangle (x-coordinate size).
   */
  public get width(): number {
    return Math.abs(this._bottomRight.x - this._topLeft.x);
  }

  /**
   * @returns The heighto f the rectangle (y-coordinate size).
   */
  public get height(): number {
    return Math.abs(this._topLeft.y - this._bottomRight.y);
  }

  /**
   * @param rectangle A rectangle
   * @returns Wether the given rectangle is contained in this rectangle.
   */
  public contains(rectangle: Rectangle): boolean {
    return this.left <= rectangle.left &&
      this.bottom <= rectangle.bottom &&
      this.top >= rectangle.top &&
      this.right >= rectangle.right;
  }
}
