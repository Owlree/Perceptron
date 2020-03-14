import * as paper from 'paper';

import { IFreePointGraphicOptions } from './ifreepointgraphicoptions';
import { PointGraphic } from './pointgraphic';
import { Vector2 } from './vector2';


/**
 * Class that represents a free draggable point. Provides mouse interaction out
 * of the box.
 */
export class FreePointGraphic extends PointGraphic {
  private _mouseDown: boolean = false;
  private _mouseOver: boolean = false;

  public constructor({
    x = 0, y = 0,
    interactive = true,
    ...options
  }: IFreePointGraphicOptions = {}) {
    super({interactive: interactive, ...options});

    this.position = new Vector2(x, y);

    if (interactive) {
      this._path.on('mouseenter', (): void => {
        this._mouseOver = true;
        this.updateStyle();
      });
      this._path.on('mouseleave', (): void => {
        this._mouseOver = false;
        this.updateStyle();
      });
      this._path.on('mousedown', (): void => {
        this._mouseDown = true;
        this.updateStyle();
      });
      paper.view.on('mouseup', (): boolean => {
        this._mouseDown = false;
        this.updateStyle();
        return true;
      });
      paper.view.on('mousemove', (event: paper.MouseEvent): void => {
        if (this._mouseDown) {
          this.position = new Vector2(event.point!.x!, event.point!.y!);
        }
      });
    }
  }

  private updateStyle(): void {
    if (this._mouseDown) {
      document.body.style.cursor = 'grabbing';
    } else if (this._mouseOver) {
      document.body.style.cursor = 'grab';
    } else {
      document.body.style.cursor = '';
    }
  }
}
