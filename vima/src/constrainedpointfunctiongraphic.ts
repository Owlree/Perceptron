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

    const functionChangedCallback = (): void => {
      const x: number = this.position.x;
      const y: number = this._functionGraphic.yAtX(x);
      this.position = new Vector2(this.position.x, y);
    };

    this.x = x;

    // TODO (Owlree) Should this be unregistered at some point?
    this._functionGraphic.register(functionChangedCallback);

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

      paper.view.on('mouseup', (): void => {
        this._mouseDown = false;
        this.updateStyle();
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

  @DecoratorWatchVariable
  private set x(x: number | Variable<number>) {
    const xn: number = x as number;
    this.position = new Vector2(xn, this._functionGraphic.yAtX(xn));
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
