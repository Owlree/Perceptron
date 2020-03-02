import * as paper from 'paper';

import * as Colors from './colors';
import BoundsSubscriber from './iboundssubscriber';
import Graphic from './graphic';
import ScreenTransformSubscriber from './iscreentransformsubscriber';
import Variable from './variable';


/**
 * A graphic calculator handles the presentation and interaction with various
 * graphics such as {@link CurveGraphic}, {@link FunctionGraphic},
 * {@link FreePointGraphic}, or others.
 */
export default class GraphingCalculator {
  private _backgroundColorVariable?: Variable<paper.Color> = undefined;
  private _backgroundColorVariableChangedCallback?:
    ((variable: Variable<paper.Color>) => void);
  private _backgroundPath: paper.Path.Rectangle;
  private _bounds: paper.Rectangle =
    new paper.Rectangle(
      new paper.Point(-Math.PI, -1.5), new paper.Point(Math.PI, 1.5));
  private readonly _graphics: Array<Graphic> = [];

  public constructor(canvasId: string) {
    paper.setup(canvasId);
    this._backgroundPath = new paper.Path.Rectangle(this._bounds);
    this.backgroundColor = Colors.backgroundColor;
    paper.view.on('resize', (): void => {
      this.setup();
    });
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
    if (this._backgroundColorVariable !== undefined &&
      this._backgroundColorVariableChangedCallback !== undefined) {
      this._backgroundColorVariable.unregister(this._backgroundColorVariableChangedCallback);
      this._backgroundColorVariable = undefined;
      this._backgroundColorVariableChangedCallback = undefined;
    }

    if (color instanceof Variable) {
      this._backgroundPath.fillColor = color.value;
      this._backgroundColorVariable = color;
      this._backgroundColorVariableChangedCallback =
        (variable: Variable<paper.Color>): void => {
          this._backgroundPath.fillColor = variable.value;
        };
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

    if ('onScreenTransformUpdated' in graphicAny) {
      const updateable: ScreenTransformSubscriber  = graphicAny as ScreenTransformSubscriber;
      updateable.onScreenTransformUpdated(paper.view.matrix!);
    }

    this._graphics.push(graphic);
    graphic.addTo(paper.project!);
  }

  public remove(graphic: Graphic): void {
    const index: number = this._graphics.indexOf(graphic);
    if (index > -1) {
      this._graphics[index].remove();
      this._graphics.splice(index, 1);
    }
  }

  private setup(): void {

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

    // Notify all screen transform subscribers of the change
    for (let graphic of this._graphics) {
      const graphicAny: any = graphic as any;
      if ('onScreenTransformUpdated' in graphicAny) {
        const updateable: ScreenTransformSubscriber =
          graphicAny as ScreenTransformSubscriber;
        updateable.onScreenTransformUpdated(paper.view.matrix!);
      }
    }
  }
}
