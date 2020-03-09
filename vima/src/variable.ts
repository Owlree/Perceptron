/**
 * Class that represents a value that may change and allows other objects to
 * subscribe to those changes. The value can't be changed from the outside.
 * The owner needs to create a {@link WriteableVariable}, casts it to a
 * {@link Variable} when giving it to other objects.
 */
export class Variable<T> {
  protected _value: T;
  protected _subscribers: Array<(self: Variable<T>) => void> = [];
  public constructor(value: T) {
    this._value = value;
  }

  /**
   * @returns The value of the variable
   */
  public get value(): T {
    return this._value;
  }

  /**
   * Register a callback that will be called whenever the value of the variable
   * changes.
   * @param callback The callback to register
   */
  public register(callback: (self: Variable<T>) => void): void {
    this._subscribers.push(callback);
  }

  /**
   * Unregisters a callback.
   * @param callback The callback to unregister
   */
  public unregister(callback: (self: Variable<T>) => void): void {
    const index: number = this._subscribers.indexOf(callback);
    if (index > -1) {
      this._subscribers.splice(index, 1);
    }
  }
}
