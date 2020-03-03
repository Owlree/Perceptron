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
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    Variable.prototype.register = function (callback) {
        this._subscribers.push(callback);
    };
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