export default class Variable<T> {
  protected _value?: T = undefined;
  protected _subscribers: Array<(self: Variable<T>) => void> = []
  constructor(value: T | undefined = undefined) {
    this._value = value;
  }
  get value(): T {
    return this._value!;
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
