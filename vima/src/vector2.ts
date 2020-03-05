export class Vector2 {
  public readonly x: number;
  public readonly y: number;

  public constructor(x: number, y: number) {
    [this.x, this.y] = [x, y];
  }

  public get array(): Array<number> {
    return [this.x, this.y];
  }

  public multiply(a: number): Vector2 {
    return new Vector2(this.x * a, this.y * a);
  }
}
