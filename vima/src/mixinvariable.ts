export class MixinVariable<T> {
  protected _subscribers: Array<(self: T) => void> = [];

  // TODO (Owlree) This code is duplicated with the generic variable code
  public register(callback: (self: T) => void): void {
    if (this._subscribers === undefined) {
      this._subscribers = [];
    }
    this._subscribers.push(callback);
  }
  public unregister(callback: (self: T) => void): void {
    const index: number = this._subscribers.indexOf(callback);
    if (index > -1) {
      this._subscribers.splice(index, 1);
    }
  }

  protected notify(): void {
    if (this._subscribers === undefined) return;
    for (let subscriber of this._subscribers) {
      subscriber(this as unknown as T);
    }
  }
}
