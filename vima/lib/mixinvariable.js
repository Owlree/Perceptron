"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MixinVariable = /** @class */ (function () {
    function MixinVariable() {
        this._subscribers = [];
    }
    // TODO (Owlree) This code is duplicated with the generic variable code
    MixinVariable.prototype.register = function (callback) {
        if (this._subscribers === undefined) {
            this._subscribers = [];
        }
        this._subscribers.push(callback);
    };
    MixinVariable.prototype.unregister = function (callback) {
        var index = this._subscribers.indexOf(callback);
        if (index > -1) {
            this._subscribers.splice(index, 1);
        }
    };
    MixinVariable.prototype.notify = function () {
        if (this._subscribers === undefined)
            return;
        for (var _i = 0, _a = this._subscribers; _i < _a.length; _i++) {
            var subscriber = _a[_i];
            subscriber(this);
        }
    };
    return MixinVariable;
}());
exports.MixinVariable = MixinVariable;
//# sourceMappingURL=mixinvariable.js.map