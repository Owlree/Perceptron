export default abstract class Graphic {
  protected _path?: paper.Path = undefined;
  public remove() {
    if (this._path)
    this._path.remove();
  }
  public addTo(owner: paper.Project | paper.Layer | paper.Group |
    paper.CompoundPath) {

    if (this._path != undefined) {
      this._path.addTo(owner);
    }
  }
}
