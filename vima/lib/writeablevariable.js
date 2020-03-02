"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const variable_1 = require("./variable");
/**
 * Class that represents a value that may change and allows other objects to
 * subscribe to those changes. This is created by variable owners that need to
 * change the value. Usually, a cast to the parent class {@link Variable} is
 * sent to other objects that don't need to change the value.
 */
class WritableVariable extends variable_1.default {
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        for (let subscriber of this._subscribers) {
            subscriber(this);
        }
    }
}
exports.default = WritableVariable;
//# sourceMappingURL=writeablevariable.js.map