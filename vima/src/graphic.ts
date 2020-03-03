import * as paper from 'paper';


/**
 * Base abstract class that represents a drawable mathematical object.
 */
export abstract class Graphic {

  // TODO (Owlree) Get rid of the path and rely exclusively on the group
  protected _path: paper.Path;
  protected _group: paper.Group;

  public constructor() {
    this._path = new paper.Path({insert: false});
    this._group = new paper.Group({insert: false});
  }

  /**
   * Removes the underlying graphic from its parent.
   */
  public remove(): void {
    this._path.remove();
    this._group.remove();
  }

  /**
   * Adds the underlying paper.js path to a paper.js project or item.
   * @param owner The paper.js project or item to add the underlying path to
   */
  public addTo(owner: paper.Project | paper.Layer | paper.Group |
    paper.CompoundPath): void {

    this._path.addTo(owner);
    this._group.addTo(owner);
  }
}
