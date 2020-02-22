import Variable from './variable';


/**
 * Decorates a property that may be a {@link Variable} or a setter that may
 * take a {@link Variable} as argument. If a {@link Variable} is indeed
 * supplied, the setter is called with the value of the variable once when it
 * is first decorated, and subsequently any time the variable changes.
 *
 * @param _
 * @param __
 * @param descriptor
 * @returns May return the a descriptor with the decorated setter
 */
export default function DecoratorWatchVariable<T>(_: any, __: string,
  descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void {

  if (descriptor !== undefined) {
    // We are dealing with a setter method
    let variable: Variable<any> | undefined = undefined;
    let callback: ((variable: Variable<any>) => void) | undefined;
    return {
      ...descriptor,
      set: function(value: T): void {
        if (variable !== undefined && callback !== undefined) {
          variable.unregister(callback);
          variable = undefined;
          callback = undefined;
        }
        if (value instanceof Variable) {
          const variable = value as Variable<any>;
          callback = (variable: Variable<any>): void => {
            if (descriptor.set !== undefined) {
              descriptor.set.call(this, variable.value as T);
            }
          };
          variable.register(callback);
          if (descriptor.set !== undefined) {
            descriptor.set.call(this, variable.value as T);
          }
        } else {
          if (descriptor.set !== undefined) {
            descriptor.set.call(this, value);
          }
        }
      }
    };
  } else {
    // We are dealing with the property itself
    // TODO (Owlree) implements this case
  }
}
