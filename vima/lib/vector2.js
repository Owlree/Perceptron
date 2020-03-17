"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A simple immutable two-dimensional vector class that can represent points,
 * sizes, etc.
 */
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        var _a;
        _a = [x, y], this.x = _a[0], this.y = _a[1];
    }
    Object.defineProperty(Vector2.prototype, "array", {
        /**
         * @returns The coordinates of the vector as a plain array
         */
        get: function () {
            return [this.x, this.y];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a vector that is equal to the vector multiplied by the scalar.
     *
     * The object is not modified. This class is immutable.
     *
     * @param a The scalar to multiply with
     * @returns The vector multiplied by the given scalar
     */
    Vector2.prototype.multiply = function (a) {
        return new Vector2(this.x * a, this.y * a);
    };
    Vector2.prototype.add = function (v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    };
    Vector2.prototype.distance = function (v) {
        var dx = this.x - v.x;
        var dy = this.y - v.y;
        return Math.sqrt((dx * dx + dy * dy));
    };
    Vector2.prototype.normalize = function () {
        return this.multiply(1 / this.length());
    };
    Vector2.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Vector2.prototype.subtract = function (v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    };
    Vector2.prototype.coordinatesTransform = function (from, to) {
        var _a = [this.x, this.y], x = _a[0], y = _a[1];
        x -= from.center.x;
        x /= (from.right - from.left);
        x *= (to.right - to.left);
        x += to.center.x;
        y -= from.center.y;
        y /= (from.top - from.bottom);
        y *= (to.top - to.bottom);
        y += to.center.y;
        return new Vector2(x, y);
    };
    return Vector2;
}());
exports.Vector2 = Vector2;
//# sourceMappingURL=vector2.js.map