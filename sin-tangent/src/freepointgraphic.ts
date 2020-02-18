import * as paper from 'paper';

import FreePointGraphicOptions from './freepointgraphicoptions';
import PointGraphic from './pointgraphic';


export default class FreePointGraphic extends PointGraphic {

  private _mouseDown: boolean = false;
  private _mouseOver: boolean = false;

  constructor({...options}: FreePointGraphicOptions = {}) {
    super(options);

    this._path.shadowColor = new paper.Color('salmon');
    this._path.shadowBlur = 0;

    this._path.on('mouseenter', () => {
      this._mouseOver = true;
      this.updateStyle();
    });

    this._path.on('mouseleave', () => {
      this._mouseOver = false;
      this.updateStyle();
    })

    this._path.on('mousedown', () => {
      this._mouseDown = true;
      this.updateStyle();
    });

    paper.view.on('mouseup', () => {
      this._mouseDown = false;
      this.updateStyle();
    });

    paper.view.on('mousemove', (event: paper.MouseEvent) => {
      if (this._mouseDown === true) {
        this.x = event.point!.x!;
        this.y = event.point!.y!;
      }
    });
  }

  private updateStyle() {
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
