import * as paper from 'paper';

import BoundsSubscriber from './boundssubscriber';
import Graphic from './graphic';
import Variable from './variable';


export default class GraphingCalculator {
  private _backgroundPath: paper.Path.Rectangle;
  private _backgroundColorVariable?: Variable<paper.Color> = undefined;
  private _backgroundColorVariableChangedCallback?: ((variable: Variable<paper.Color>) => void);
  private _graphics: Array<Graphic> = [];
  private _bounds: paper.Rectangle = new paper.Rectangle(
    new paper.Point(-Math.PI, -1.5), new paper.Point(Math.PI, 1.5));

  setup() {

    // Revert the previous transform
    paper.view.transform(paper.view.matrix!.inverted());

    // Apply the new transform
    paper.view.transform(new paper.Matrix(
      paper.view.viewSize!.width! / this._bounds.width!, 0,
      0, -paper.view.viewSize!.height! / this._bounds.height!,
      paper.view.viewSize!.width! / 2,
      paper.view.viewSize!.height! / 2,
    ));
    paper.view.transform(new paper.Matrix(
      1, 0,
      0, 1,
      -this._bounds.center!.x!, -this._bounds.center!.y!
    ));
  }

  constructor(canvasId: string) {
    paper.setup(canvasId);
    this._backgroundPath = new paper.Path.Rectangle(this._bounds);
    this._backgroundPath.fillColor = new paper.Color('pink');
    paper.view.on('resize', () => { this.setup() });
    this.setup();
  }

  public set bounds(bounds: paper.Rectangle) {
    this._bounds = bounds;
    this._backgroundPath.bounds = bounds;
    this.setup();

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

  public set backgroundColor(color: Variable<paper.Color> | paper.Color) {
    if (this._backgroundColorVariable !== undefined && this._backgroundColorVariableChangedCallback !== undefined) {
      this._backgroundColorVariable.unregister(this._backgroundColorVariableChangedCallback);
      this._backgroundColorVariable = undefined;
      this._backgroundColorVariableChangedCallback = undefined;
    }

    if (color instanceof Variable) {
      this._backgroundPath.fillColor = color.value;
      this._backgroundColorVariable = color;
      this._backgroundColorVariableChangedCallback = (variable: Variable<paper.Color>) => {
        this._backgroundPath.fillColor = variable.value;
      }
      this._backgroundColorVariable.register(this._backgroundColorVariableChangedCallback);
    } else {
      this._backgroundPath.fillColor = color;
    }
  }

  public add(graphic: Graphic): void {

    const graphicAny: any = graphic as any;

    if ('onBoundsUpdated' in graphicAny) {
      const updateable: BoundsSubscriber  = graphicAny as BoundsSubscriber;
      updateable.onBoundsUpdated(this._bounds);
    }

    this._graphics.push(graphic);
    graphic.addTo(paper.project!);
  }

  public remove(graphic: Graphic) {
    const index: number = this._graphics.indexOf(graphic);
    if (index > -1) {
      this._graphics[index].remove();
      this._graphics.splice(index, 1);
    }
  }
}
