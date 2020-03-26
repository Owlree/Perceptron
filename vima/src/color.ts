export class Color {

  private _red: number = 0;
  private _green: number = 0;
  private _blue: number = 0;
  private _alpha: number = 0;

  constructor(red: number, green: number, blue: number, alpha: number = 1) {
    [
      this.red,
      this.green,
      this.blue,
      this.alpha
    ] = [
      red,
      green,
      blue,
      alpha
    ];
  }

  public toCSS(): string {
    return `rgba(${this._red}, ${this._green}, ${this._blue}, ${this._alpha})`;
  }

  public mix(that: Color, percentage: number) {
    return new Color(
      (this.red * (1 - percentage) + that.red * percentage),
      (this.green * (1 - percentage) + that.green * percentage),
      (this.blue * (1 - percentage) + that.blue * percentage),
      (this.alpha * (1 - percentage) + that.alpha * percentage)
    );
  }

  public withAlpha(alpha: number) {
    return new Color(this.red, this.green, this.blue, alpha);
  }

  public set red(red: number) {
    this._red = Math.max(0, Math.min(red, 255));
  }

  public set green(green: number) {
    this._green = Math.max(0, Math.min(green, 255));
  }

  public set blue(blue: number) {
    this._blue = Math.max(0, Math.min(blue, 255));
  }

  public set alpha(alpha: number) {
    this._alpha = Math.max(0, Math.min(alpha, 1));
  }

  public get red() {
    return this._red;
  }

  public get green() {
    return this._green;
  }

  public get blue() {
    return this._blue;
  }

  public get alpha() {
    return this._alpha;
  }
}
