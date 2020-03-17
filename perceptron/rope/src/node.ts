import { Rectangle } from 'vima';

export abstract class Node {
  public visible: boolean = true;
  public abstract draw(context: CanvasRenderingContext2D, bounds: Rectangle, canvasBounds: Rectangle): void;
}
