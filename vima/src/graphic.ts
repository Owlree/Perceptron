import * as paper from 'paper';


/**
 * Base abstract class that represents a drawable mathematical object.
 */
export abstract class Graphic {
  protected _item: paper.Item;

  public constructor() {
    this._item = new paper.Path({insert: false});
  }

  /**
   * Removes the underlying graphic from its parent.
   */
  public remove(): void {
    this._item.remove();
  }

  /**
   * Adds the underlying paper.js path to a paper.js project or item.
   * @param owner The paper.js project or item to add the underlying path to
   */
  public addTo(owner: paper.Project | paper.Layer | paper.Group |
    paper.CompoundPath): void {

    this._item.addTo(owner);
  }

  // TODO (Owlree) Paper events are exposed, create intermediary event class
  public on(event: string, callback: Function) {
    this._item.on(event, callback);
  }
}
