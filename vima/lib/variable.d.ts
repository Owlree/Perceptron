/**
 * Class that represents a value that may change and allows other objects to
 * subscribe to those changes. The value can't be changed from the outside.
 * The owner needs to create a {@link WriteableVariable}, casts it to a
 * {@link Variable} when giving it to other objects.
 */
export declare class Variable<T> {
    protected _value: T;
    protected _subscribers: Array<(self: Variable<T>) => void>;
    constructor(value: T);
    /**
     * @returns The value of the variable
     */
    get value(): T;
    /**
     * Register a callback that will be called whenever the value of the variable
     * changes.
     * @param callback The callback to register
     */
    register(callback: (self: Variable<T>) => void): void;
    /**
     * Unregisters a callback.
     * @param callback The callback to unregister
     */
    unregister(callback: (self: Variable<T>) => void): void;
}
//# sourceMappingURL=variable.d.ts.map