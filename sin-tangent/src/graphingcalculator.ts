import * as paper from 'paper';

import BoundsSubscriber from './boundssubscriber';
import Graphic from './graphic';

export default class GraphingCalculator {
  private _graphics: Array<Graphic> = [];
  private _bounds: paper.Rectangle = new paper.Rectangle(
    new paper.Point(-Math.PI, -1.5), new paper.Point(Math.PI, 1.5));

  setup() {

    // Revert the previous transform
    paper.view.transform(paper.view.matrix.inverted());

    // Apply the new transform
    paper.view.transform(new paper.Matrix(
      paper.view.viewSize.width / this._bounds.width, 0,
      0, -paper.view.viewSize.height / this._bounds.height,
      paper.view.viewSize.width / 2,
      paper.view.viewSize.height / 2,
    ));
    paper.view.transform(new paper.Matrix(
      1, 0,
      0, 1,
      -this._bounds.center.x, -this._bounds.center.y
    ));

    // Notify the bounds update on all objects that implement the subscriber
    // interface
    for (let graphic of this._graphics) {
      const updateable: BoundsSubscriber | undefined =
        graphic as unknown as BoundsSubscriber;
      if (updateable !== undefined) {
        updateable.onBoundsUpdated(this._bounds);
      }
    }
  }

  constructor(canvasId: string) {
    paper.setup(canvasId);
    paper.view.on('resize', () => { this.setup() });
    this.setup();
  }

  public add(graphic: Graphic): void {

    const graphicAny: any = graphic as any;

    if ('onBoundsUpdated' in graphicAny) {
      const updateable: BoundsSubscriber  = graphicAny as BoundsSubscriber;
      updateable.onBoundsUpdated(this._bounds);
    }

    this._graphics.push(graphic);
    graphic.addTo(paper.project);
  }

  public remove(graphic: Graphic) {
    const index: number = this._graphics.indexOf(graphic);
    if (index > -1) {
      this._graphics[index].remove();
      this._graphics.splice(index, 1);
    }
  }
}
