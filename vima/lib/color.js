"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Color = /** @class */ (function () {
    function Color(red, green, blue, alpha) {
        var _a;
        if (alpha === void 0) { alpha = 1; }
        this._red = 0;
        this._green = 0;
        this._blue = 0;
        this._alpha = 0;
        _a = [
            red,
            green,
            blue,
            alpha
        ], this.red = _a[0], this.green = _a[1], this.blue = _a[2], this.alpha = _a[3];
    }
    Color.prototype.toCSS = function () {
        return "rgba(" + this._red + ", " + this._green + ", " + this._blue + ", " + this._alpha + ")";
    };
    Color.prototype.mix = function (that, percentage) {
        return new Color((this.red * (1 - percentage) + that.red * percentage), (this.green * (1 - percentage) + that.green * percentage), (this.blue * (1 - percentage) + that.blue * percentage), (this.alpha * (1 - percentage) + that.alpha * percentage));
    };
    Color.prototype.withAlpha = function (alpha) {
        return new Color(this.red, this.green, this.blue, alpha);
    };
    Object.defineProperty(Color.prototype, "red", {
        get: function () {
            return this._red;
        },
        set: function (red) {
            this._red = Math.max(0, Math.min(red, 255));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "green", {
        get: function () {
            return this._green;
        },
        set: function (green) {
            this._green = Math.max(0, Math.min(green, 255));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "blue", {
        get: function () {
            return this._blue;
        },
        set: function (blue) {
            this._blue = Math.max(0, Math.min(blue, 255));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "alpha", {
        get: function () {
            return this._alpha;
        },
        set: function (alpha) {
            this._alpha = Math.max(0, Math.min(alpha, 1));
        },
        enumerable: true,
        configurable: true
    });
    return Color;
}());
exports.Color = Color;
//# sourceMappingURL=color.js.map