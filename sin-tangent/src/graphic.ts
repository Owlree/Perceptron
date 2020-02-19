import * as paper from 'paper';


/**
 * Base abstract class that represents a drawable mathematical object.
 */
export default abstract class Graphic {
  protected _path: paper.Path;

  /**
   * Removes the underlying graphic from its parent.
   */
  public remove() {
    this._path.remove();
  }

  /**
   * Adds the underlying paper.js path to a paper.js project or item.
   * @param owner The paper.js project or item to add the underlying path to
   */
  public addTo(owner: paper.Project | paper.Layer | paper.Group |
    paper.CompoundPath) {

    this._path.addTo(owner);
  }

  constructor() {
    this._path = new paper.Path({insert: false});
  }
}
