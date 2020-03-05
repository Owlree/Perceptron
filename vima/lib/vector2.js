"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        var _a;
        _a = [x, y], this.x = _a[0], this.y = _a[1];
    }
    Object.defineProperty(Vector2.prototype, "array", {
        get: function () {
            return [this.x, this.y];
        },
        enumerable: true,
        configurable: true
    });
    Vector2.prototype.multiply = function (a) {
        return new Vector2(this.x * a, this.y * a);
    };
    return Vector2;
}());
exports.Vector2 = Vector2;
//# sourceMappingURL=vector2.js.map