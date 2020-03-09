import { Variable } from './variable';
/**
 * Class that represents a value that may change and allows other objects to
 * subscribe to those changes. This is usually created by variable owners that
 * need to change the value. Usually, a cast to the parent class
 * {@link Variable} is sent to other objects that don't need to change the
 * value.
 */
export declare class WritableVariable<T> extends Variable<T> {
    /**
     * @returns The value of the variable
     */
    get value(): T;
    /**
     * @param value The new value of the variable
     */
    set value(value: T);
}
//# sourceMappingURL=writablevariable.d.ts.map