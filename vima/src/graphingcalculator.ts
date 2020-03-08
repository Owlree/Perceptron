import * as paper from 'paper';

import * as Colors from './colors';
import { Event } from './event';
import { Graphic } from './graphic';
import { IBoundsSubscriber } from './iboundssubscriber';
import { IScreenTransformSubscriber } from './iscreentransformsubscriber';
import { Rectangle } from './rectangle';
import { Variable } from './variable';
import { Vector2 } from './vector2';
import { DecoratorWatchVariable } from './decoratorwatchvariable';


/**
 * A graphic calculator handles the presentation and interaction with various
 * graphics such as {@link CurveGraphic}, {@link FunctionGraphic},
 * {@link FreePointGraphic}, or others.
 */
export class GraphingCalculator {
  private _bounds: Rectangle = new Rectangle(new Vector2(0, 0), new Vector2(0, 0));
  private _mousePosition: Vector2 = new Vector2(0, 0);
  private _screenMatrix: paper.Matrix = new paper.Matrix(1, 0, 0, 1, 0, 0);
  private readonly _backgroundPath: paper.Path.Rectangle;
  private readonly _graphics: Array<Graphic> = [];

  public constructor(canvasId: string, bounds: Rectangle) {
    paper.setup(canvasId);

    this._backgroundPath = new paper.Path.Rectangle(new paper.Point(0, 0), new paper.Point(1, 1));
    this.bounds = bounds;
    this.backgroundColor = Colors.backgroundColor;

    paper.view.on('resize', (): void => {
      this.setup();
    });
  }

  public set bounds(bounds: Rectangle) {
    this._bounds = bounds;
    this._backgroundPath.bounds = new paper.Rectangle(
      bounds.left, bounds.bottom, bounds.width, bounds.height
    );

    // Transforms the paper view according to the new bounds
    this.setup();

    // Notify the bounds update on all objects that implement the subscriber
    // interface
    for (let graphic of this._graphics) {
      const updateable: IBoundsSubscriber | undefined =
        graphic as unknown as IBoundsSubscriber;
      if (updateable !== undefined) {
        updateable.onBoundsUpdated(this._bounds);
      }
    }
  }

  /**
   * @param color The color or variable color to set as background
   */
  @DecoratorWatchVariable
  public set backgroundColor(color: Variable<paper.Color> | paper.Color) {
    this._backgroundPath.fillColor = color as paper.Color;
  }

  /**
   * Adds a graphic to the graphing calculator
   * @param graphic The graphic to add
   */
  public add(graphic: Graphic): void {

    const graphicAny: any = graphic as any;

    if ('onBoundsUpdated' in graphicAny) {
      const updateable: IBoundsSubscriber  = graphicAny as IBoundsSubscriber;
      updateable.onBoundsUpdated(this._bounds);
    }

    if ('onScreenTransformUpdated' in graphicAny) {
      const updateable: IScreenTransformSubscriber  = graphicAny as IScreenTransformSubscriber;
      updateable.onScreenTransformUpdated(paper.view.matrix!);
    }

    this._graphics.push(graphic);
    graphic.addTo(paper.project!);
  }

  /**
   * Removes a graphic from the graphing calculator
   * @param graphic The graphic to remove
   */
  public remove(graphic: Graphic): void {
    const index: number = this._graphics.indexOf(graphic);
    if (index > -1) {
      this._graphics[index].remove();
      this._graphics.splice(index, 1);
    }
  }

  private setup(): void {

    // Revert the previous transform
    paper.view.transform(this._screenMatrix.inverted());

    // Apply the new transform
    paper.view.transform(new paper.Matrix(
      paper.view.viewSize.width / this._bounds.width, 0,
      0, -paper.view.viewSize.height! / this._bounds.height,
      paper.view.viewSize.width / 2, paper.view.viewSize.height / 2,
    ));
    paper.view.transform(new paper.Matrix(
      1, 0,
      0, 1,
      -this._bounds.center.x, -this._bounds.center.y
    ));

    this._screenMatrix = paper.view.matrix;

    // Notify all screen transform subscribers of the change
    for (let graphic of this._graphics) {
      const graphicAny: any = graphic as any;
      if ('onScreenTransformUpdated' in graphicAny) {
        const updateable: IScreenTransformSubscriber =
          graphicAny as IScreenTransformSubscriber;
        updateable.onScreenTransformUpdated(paper.view.matrix!);
      }
    }

    // Subscribe to the mouse position
    paper.view.element.addEventListener('mousemove', (event: MouseEvent) => {
      const point: paper.Point = new paper.Point(event.clientX, event.clientY);
      const localPoint: paper.Point = point.transform(this._screenMatrix.inverted());
      this._mousePosition = new Vector2(localPoint.x, localPoint.y);
    });

    paper.view.element.addEventListener('touchstart', (event: TouchEvent) => {
      const point: paper.Point = new paper.Point(
        event.touches[0].pageX, event.touches[0].pageY);
      const localPoint: paper.Point = point.transform(this._screenMatrix.inverted());
      this._mousePosition = new Vector2(localPoint.x, localPoint.y);
    });

    paper.view.element.addEventListener('touchmove', (event: TouchEvent) => {
      const point: paper.Point = new paper.Point(
        event.touches[0].pageX, event.touches[0].pageY);
      const localPoint: paper.Point = point.transform(this._screenMatrix.inverted());
      this._mousePosition = new Vector2(localPoint.x, localPoint.y);
    });
  }

  // TODO (Owlree) Paper events are exposed, create intermediary event class
  public on(event: string, callback: (event: Event) => void): void {
    if (event === 'frame') {
      paper.view.on(event, (event: any) => {
        callback({time: event.time})
      });
    } else {
      paper.view.on(event, callback);
    }
  }

  public get mousePosition(): Vector2 {
    return this._mousePosition;
  }

  public contains(position: Vector2) {
    return paper.view.bounds.contains(new paper.Point(position.x, position.y));
  }
}
