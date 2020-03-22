import { Rectangle } from './rectangle';

export abstract class CanvasObject {
  public visible: boolean = true;
  public abstract draw(
    context:      CanvasRenderingContext2D,
    bounds:       Rectangle,
    canvasBounds: Rectangle): void;
  public update(_: number, __: number): void {};
}
