"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MixinVariableListener = /** @class */ (function () {
    function MixinVariableListener() {
        this._variableCallbacks = {};
    }
    MixinVariableListener.prototype.saveVariableCallbackRef = function (key, callback, variable) {
        if (this._variableCallbacks === undefined) {
            this._variableCallbacks = {};
        }
        this._variableCallbacks[key] = { callback: callback, variable: variable };
    };
    MixinVariableListener.prototype.removeVariableCallbackRef = function (key) {
        if (this._variableCallbacks === undefined)
            return;
        delete this._variableCallbacks[key];
    };
    MixinVariableListener.prototype.unregisterAllVariableCallbacks = function () {
        if (this._variableCallbacks === undefined)
            return;
        for (var key in this._variableCallbacks) {
            this._variableCallbacks[key].variable.unregister(this._variableCallbacks[key].callback);
        }
    };
    MixinVariableListener.prototype.getVariableCallbackRef = function (key) {
        if (this._variableCallbacks === undefined)
            return {};
        if (key in this._variableCallbacks) {
            return this._variableCallbacks[key];
        }
        else {
            return {};
        }
    };
    return MixinVariableListener;
}());
exports.MixinVariableListener = MixinVariableListener;
//# sourceMappingURL=mixinvariablelistener.js.map