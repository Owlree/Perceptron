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
    return Vector2;
}());
exports.Vector2 = Vector2;
//# sourceMappingURL=vector2.js.map