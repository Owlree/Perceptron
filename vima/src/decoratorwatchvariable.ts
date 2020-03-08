import { Variable } from './variable';
import { IVariableListener } from './ivariablelistener';


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
export function DecoratorWatchVariable<T>(_: any, name: string,
  descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void {
  if (descriptor !== undefined && descriptor.set !== undefined) {
    return {
      ...descriptor,
      set: function(value: T): void {
        const {variable, callback} = (this as IVariableListener).getVariableCallbackRef(name);
        if (variable !== undefined && callback !== undefined) {
          variable.unregister(callback);
          (this as IVariableListener).removeVariableCallbackRef(name);
        }
        if (value instanceof Variable) {
          const variable = value as Variable<any>;
          const callback = (variable: Variable<any>): void => {
            if (descriptor.set !== undefined) {
              descriptor.set.call(this, variable.value as T);
            }
          };
          variable.register(callback);
          (this as IVariableListener).saveVariableCallbackRef(name, callback, variable);
          if (descriptor.set !== undefined) { // TODO (Owlree) This condition should not be necessary
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
