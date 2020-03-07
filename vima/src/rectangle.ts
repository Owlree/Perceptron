import { Vector2 } from "./vector2";

export class Rectangle {
  private readonly _topLeft: Vector2;
  private readonly _bottomRight: Vector2;

  constructor(topLeft: Vector2, bottomRight: Vector2) {
    this._topLeft = topLeft;
    this._bottomRight = bottomRight;
  }

  public get topLeft(): Vector2 {
    return this._topLeft;
  }

  public get topRight(): Vector2 {
    return new Vector2(this._bottomRight.x, this._topLeft.y);
  }

  public get bottomLeft(): Vector2 {
    return new Vector2(this._topLeft.x, this._bottomRight.y);
  }

  public get bottomRight(): Vector2 {
    return this._bottomRight
  }

  public get center(): Vector2 {
    return new Vector2(
      (this._topLeft.x + this._bottomRight.x) / 2,
      (this._topLeft.y + this._bottomRight.y) / 2
    );
  }

  public get top(): number {
    return this._topLeft.y;
  }

  public get right(): number {
    return this._bottomRight.x;
  }

  public get bottom(): number {
    return this._bottomRight.y;
  }

  public get left(): number {
    return this._topLeft.x;
  }

  public get width(): number {
    return Math.abs(this._bottomRight.x - this._topLeft.x);
  }

  public get height(): number {
    return Math.abs(this._topLeft.y - this._bottomRight.y);
  }

  public contains(rectangle: Rectangle): boolean {
    return this.left <= rectangle.left &&
      this.bottom <= rectangle.bottom &&
      this.top >= rectangle.top &&
      this.right >= rectangle.right;
  }
}
