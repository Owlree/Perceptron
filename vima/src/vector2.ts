
export default class Vector2 {
  public readonly x: number;
  public readonly y: number;

  public constructor(x: number, y: number) {
    [this.x, this.y] = [x, y];
  }

  public get array(): Array<number> {
    return [this.x, this.y];
  }
}
