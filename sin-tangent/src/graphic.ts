/**
 * Base abstract class for all drawable mathematicall objects.
 */
export default abstract class Graphic {
  protected _path?: paper.Path = undefined;

  /**
   * Removes the underlying graphic from its parent.
   */
  public remove() {
    if (this._path !== undefined) {
      this._path.remove();
    }
  }

  /**
   * Adds the underlying paper.js path to a paper.js project or item.
   * @param owner The paper.js project or item to add the underlying path to
   */
  public addTo(owner: paper.Project | paper.Layer | paper.Group |
    paper.CompoundPath) {

    if (this._path !== undefined) {
      this._path.addTo(owner);
    }
  }
}
