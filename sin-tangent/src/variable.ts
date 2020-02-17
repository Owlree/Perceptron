export default class Variable<T> {
  private _value: T | undefined = undefined;
  private _subscribers: Array<(self: Variable<T>) => void> = []
  constructor(value: T | undefined = undefined) {
    this._value = value;
  }
  set value(value: T) {
    this._value = value;
    for (let subscriber of this._subscribers) {
      subscriber(this);
    }
  }
  get value(): T | undefined {
    return this._value;
  }
  public register(callback: (self: Variable<T>) => void): void {
    this._subscribers.push(callback);
  }
  public unregister(callback: (self: Variable<T>) => void): void {
    const index: number = this._subscribers.indexOf(callback);
    if (index > -1) {
      this._subscribers.splice(index, 1);
    }
  }
}
