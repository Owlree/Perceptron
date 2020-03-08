import { Variable } from './variable';
import { IVariableListener } from './ivariablelistener';


/**
 * Decorates a property that may be a {@link Variable} or a setter that may
 * take a {@link Variable} as argument. If a {@link Variable} is indeed
 * supplied, the setter is called with the value of the variable once when it
 * is first decorated, and subsequently any time the variable changes.
 *
 * @param _
 * @param name The name of the property
 * @param descriptor The descriptor of the property
 * @returns A descriptor with a setter decorated accordingly
 */
export function DecoratorWatchVariable<T>(_: any, name: string,
  descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void {
  if (descriptor !== undefined && descriptor.set !== undefined) {
    return {
      ...descriptor,
      set: function(value: T): void {
        const thisvl: IVariableListener = this as IVariableListener;
        const {variable, callback} = thisvl.getVariableCallbackRef(name);
        if (variable !== undefined && callback !== undefined) {
          variable.unregister(callback);
          thisvl.removeVariableCallbackRef(name);
        }
        if (value instanceof Variable) {
          const variable = value as Variable<any>;
          const callback = (variable: Variable<any>): void => {
            if (descriptor.set !== undefined) {
              descriptor.set.call(this, variable.value as T);
            }
          };
          variable.register(callback);
          thisvl.saveVariableCallbackRef(name, callback, variable);
          // TODO (Owlree) This condition should not be necessary
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
