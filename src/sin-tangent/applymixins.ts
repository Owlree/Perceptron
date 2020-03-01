export default function applyMixins(derivedCtor: any, baseCtors: Array<any>): void {
  baseCtors.forEach((baseCtor): void => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name: string): void => {
      Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name)!);
    });
  });
}
