/**
 * Copies all methods of multiple classes into one class
 * @param derivedCtor The class to copy methods into
 * @param baseCtors The classes whose methods to copy
 */
export function applyMixins(derivedCtor: any, baseCtors: Array<any>): void {
  baseCtors.forEach((baseCtor): void => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(
      (name: string): void => {
        Object.defineProperty(
          derivedCtor.prototype,
          name,
          Object.getOwnPropertyDescriptor(
            baseCtor.prototype,
            name)!);
      });
  });
}
