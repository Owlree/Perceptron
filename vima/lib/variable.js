"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class that represents a value that may change and allows other objects to
 * subscribe to those changes. The value can't be changed from the outside.
 * The owner needs to create a {@link WriteableVariable}, casts it to a
 * {@link Variable} when giving it to other objects.
 */
var Variable = /** @class */ (function () {
    function Variable(value) {
        this._subscribers = [];
        this._value = value;
    }
    Object.defineProperty(Variable.prototype, "value", {
        /**
         * @returns The value of the variable
         */
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Register a callback that will be called whenever the value of the variable
     * changes.
     * @param callback The callback to register
     */
    Variable.prototype.register = function (callback) {
        this._subscribers.push(callback);
    };
    /**
     * Unregisters a callback.
     * @param callback The callback to unregister
     */
    Variable.prototype.unregister = function (callback) {
        var index = this._subscribers.indexOf(callback);
        if (index > -1) {
            this._subscribers.splice(index, 1);
        }
    };
    return Variable;
}());
exports.Variable = Variable;
//# sourceMappingURL=variable.js.map