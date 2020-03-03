"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var variable_1 = require("./variable");
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
        var variable_2 = undefined;
        var callback_1;
        return __assign(__assign({}, descriptor), { set: function (value) {
                var _this = this;
                if (variable_2 !== undefined && callback_1 !== undefined) {
                    variable_2.unregister(callback_1);
                    variable_2 = undefined;
                    callback_1 = undefined;
                }
                if (value instanceof variable_1.Variable) {
                    var variable_3 = value;
                    callback_1 = function (variable) {
                        if (descriptor.set !== undefined) {
                            descriptor.set.call(_this, variable.value);
                        }
                    };
                    variable_3.register(callback_1);
                    if (descriptor.set !== undefined) {
                        descriptor.set.call(this, variable_3.value);
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
exports.DecoratorWatchVariable = DecoratorWatchVariable;
//# sourceMappingURL=decoratorwatchvariable.js.map