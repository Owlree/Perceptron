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
export default function DecoratorWatchVariable<T>(_: any, __: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;
//# sourceMappingURL=decoratorwatchvariable.d.ts.map