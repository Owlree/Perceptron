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
export declare function DecoratorWatchVariable<T>(_: any, name: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;
//# sourceMappingURL=decoratorwatchvariable.d.ts.map