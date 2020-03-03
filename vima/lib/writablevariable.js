"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var variable_1 = require("./variable");
/**
 * Class that represents a value that may change and allows other objects to
 * subscribe to those changes. This is created by variable owners that need to
 * change the value. Usually, a cast to the parent class {@link Variable} is
 * sent to other objects that don't need to change the value.
 */
var WritableVariable = /** @class */ (function (_super) {
    __extends(WritableVariable, _super);
    function WritableVariable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(WritableVariable.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._value = value;
            for (var _i = 0, _a = this._subscribers; _i < _a.length; _i++) {
                var subscriber = _a[_i];
                subscriber(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    return WritableVariable;
}(variable_1.Variable));
exports.WritableVariable = WritableVariable;
//# sourceMappingURL=writablevariable.js.map