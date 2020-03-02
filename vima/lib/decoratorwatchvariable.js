"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const variable_1 = require("./variable");
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
function DecoratorWatchVariable(_, __, descriptor) {
    if (descriptor !== undefined && descriptor.set !== undefined) {
        // We are dealing with a setter method
        let variable = undefined;
        let callback;
        return Object.assign(Object.assign({}, descriptor), { set: function (value) {
                if (variable !== undefined && callback !== undefined) {
                    variable.unregister(callback);
                    variable = undefined;
                    callback = undefined;
                }
                if (value instanceof variable_1.default) {
                    const variable = value;
                    callback = (variable) => {
                        if (descriptor.set !== undefined) {
                            descriptor.set.call(this, variable.value);
                        }
                    };
                    variable.register(callback);
                    if (descriptor.set !== undefined) {
                        descriptor.set.call(this, variable.value);
                    }
                }
                else {
                    if (descriptor.set !== undefined) {
                        descriptor.set.call(this, value);
                    }
                }
            } });
    }
    else {
        // We are dealing with the property itself
        // TODO (Owlree) implements this case
    }
}
exports.default = DecoratorWatchVariable;
//# sourceMappingURL=decoratorwatchvariable.js.map