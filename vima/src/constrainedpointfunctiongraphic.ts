import * as paper from 'paper';

import { IConstrainedPointFunctionGraphicOptions } from './iconstrainedpointfunctiongraphicoptions';
import { FunctionGraphic } from './functiongraphic';
import { PointGraphic } from './pointgraphic';
import { Vector2 } from './vector2';
import { Variable } from './variable';
import { DecoratorWatchVariable } from './decoratorwatchvariable';


/**
 * Class that represents a point constrained to move along a
 * {@link FunctionGraphic}. Provides mouse interaction out of the
 * box. When the point is dragged, the abscissa of the mouse position is used
 * as input to the function to get the ordinate.
 */
export class ConstrainedPointFunctionGraphic extends PointGraphic {
  private _mouseDown: boolean = false;
  private _mouseOver: boolean = false;
  private readonly _functionGraphic: FunctionGraphic;

  public constructor(functionGraphic: FunctionGraphic, {
    x = 0,
    interactive = true,
    ...options
  }: IConstrainedPointFunctionGraphicOptions = {}) {
    super({ interactive: interactive, ...options });

    this._functionGraphic = functionGraphic;
    this.x = x;

    // This callback is to be called anytime the given function changes, so we
    // can update the ordinate of the point accordingly
    const functionChangedCallback = (): void => {
      const x: number = this.position.x;
      const y: number = this._functionGraphic.yAtX(x);
      this.position = new Vector2(this.position.x, y);
    };

    // TODO (Owlree) Should this be unregistered at some point?
    this._functionGraphic.register(functionChangedCallback);

    if (interactive) {
      this._item.on('mouseenter', (): void => {
        this._mouseOver = true;
        this.updateCursorStyle();
      });

      this._item.on('mouseleave', (): void => {
        this._mouseOver = false;
        this.updateCursorStyle();
      });

      this._item.on('mousedown', (): void => {
        this._mouseDown = true;
        this.updateCursorStyle();
      });

      paper.view.on('mouseup', (): void => {
        this._mouseDown = false;
        this.updateCursorStyle();
      });

      paper.view.on('mousemove', (event: paper.MouseEvent): void => {
        if (this._mouseDown) {
          const x: number = event.point!.x!;
          const y: number = this._functionGraphic.yAtX(x);
          this.position = new Vector2(x, y);
        }
      });
    }
  }

  /**
   * @param x The new abscissa of the point
   */
  @DecoratorWatchVariable
  public set x(x: number | Variable<number>) {
    const xn: number = x as number;
    this.position = new Vector2(xn, this._functionGraphic.yAtX(xn));
  }

  /**
   * Updates the cursor style based on what actions are performed on the object
   */
  private updateCursorStyle(): void {
    if (this._mouseDown) {
      paper.view.element.style.cursor = 'grabbing';
    } else if (this._mouseOver) {
      paper.view.element.style.cursor = 'grab';
    } else {
      paper.view.element.style.cursor = '';
    }
  }
}
