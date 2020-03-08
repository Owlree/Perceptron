"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copies all methods of multiple classes into one class
 * @param derivedCtor The class to copy methods into
 * @param baseCtors The classes whose methods to copy
 */
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
        });
    });
}
exports.applyMixins = applyMixins;
//# sourceMappingURL=applymixins.js.map