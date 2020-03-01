import Variable from './variable';


/**
 * Class that represents a value that may change and allows other objects to
 * subscribe to those changes. This is created by variable owners that need to
 * change the value. Usually, a cast to the parent class {@link Variable} is
 * sent to other objects that don't need to change the value.
 */
export default class WritableVariable<T> extends Variable<T> {
  public get value(): T {
    return this._value;
  }
  public set value(value: T) {
    this._value = value;
    for (let subscriber of this._subscribers) {
      subscriber(this);
    }
  }
}
