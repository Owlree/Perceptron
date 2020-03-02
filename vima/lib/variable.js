"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class that represents a value that may change and allows other objects to
 * subscribe to those changes. The value can't be changed from the outside.
 * The owner needs to create a {@link WriteableVariable}, casts it to a
 * {@link Variable} when giving it to other objects.
 */
class Variable {
    constructor(value) {
        this._subscribers = [];
        this._value = value;
    }
    get value() {
        return this._value;
    }
    register(callback) {
        this._subscribers.push(callback);
    }
    unregister(callback) {
        const index = this._subscribers.indexOf(callback);
        if (index > -1) {
            this._subscribers.splice(index, 1);
        }
    }
}
exports.default = Variable;
//# sourceMappingURL=variable.js.map