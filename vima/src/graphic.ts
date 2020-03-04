import * as paper from 'paper';


/**
 * Base abstract class that represents a drawable mathematical object.
 */
export abstract class Graphic {

  // TODO (Owlree) Get rid of the path and rely exclusively on the group
  protected _path: paper.Path;
  protected _group: paper.Group;
  protected _text: paper.PointText;

  public constructor() {
    this._path = new paper.Path({insert: false});
    this._group = new paper.Group({insert: false});
    this._text = new paper.PointText([0, 0]);
  }

  /**
   * Removes the underlying graphic from its parent.
   */
  public remove(): void {
    this._path.remove();
    this._group.remove();
    this._text.remove();
  }

  /**
   * Adds the underlying paper.js path to a paper.js project or item.
   * @param owner The paper.js project or item to add the underlying path to
   */
  public addTo(owner: paper.Project | paper.Layer | paper.Group |
    paper.CompoundPath): void {

    this._path.addTo(owner);
    this._group.addTo(owner);
    this._text.addTo(owner);
  }

  // TODO (Owlree) Paper events are exposed, create intermediary event class
  public on(event: string, callback: Function) {
    this._group.on(event, callback);
    this._path.on(event, callback);
  }
}
