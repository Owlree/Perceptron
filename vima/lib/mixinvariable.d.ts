export default class MixinVariable<T> {
    protected _subscribers: Array<(self: T) => void>;
    register(callback: (self: T) => void): void;
    unregister(callback: (self: T) => void): void;
    protected notify(): void;
}
//# sourceMappingURL=mixinvariable.d.ts.map