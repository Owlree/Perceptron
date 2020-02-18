import Variable from './variable';


export default class WritableVariable<T> extends Variable<T> {
  get value(): T {
    return this._value!;
  }
  set value(value: T) {
    this._value = value;
    for (let subscriber of this._subscribers) {
      subscriber(this);
    }
  }
}
