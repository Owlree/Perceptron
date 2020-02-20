import * as paper from 'paper';

import ConstrainedPointFunctionGraphicOptions from './iconstrainedpointfunctiongraphicoptions';
import FunctionGraphic from './functiongraphic';
import PointGrahic from './pointgraphic';


/**
 * Class that represents a point constrained to move along a
 * {@link FunctionGraphic}. Provides mouse interaction out of the
 * box. When the point is dragged, the abscissa of the mouse position is used
 * as input to the function to get the ordinate.
 */
export default class ConstrainedPointFunctionGraphic extends PointGrahic {

  private _mouseDown: boolean = false;
  private _mouseOver: boolean = false;
  private _functionGraphic: FunctionGraphic;

  public constructor(functionGraphic: FunctionGraphic, {x = 0, ...options}: ConstrainedPointFunctionGraphicOptions = {}) {
    super(options);

    this._functionGraphic = functionGraphic;

    this._path.shadowColor = new paper.Color('salmon');
    this._path.shadowBlur = 0;

    this.x = x;
    this.y = functionGraphic.yAtX(x);

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
        this.x = event.point!.x!;
        this.y = this._functionGraphic.yAtX(this.x);
      }
    });
  }

  private updateStyle(): void {
    if (this._mouseDown) {
      this._path.shadowBlur = this.radius;
      document.body.style.cursor = 'grabbing';
    } else if (this._mouseOver) {
      this._path.shadowBlur = this.radius;
      document.body.style.cursor = 'grab';
    } else {
      this._path.shadowBlur = 0;
      document.body.style.cursor = '';
    }
  }
}
