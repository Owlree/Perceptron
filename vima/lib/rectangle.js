"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vector2_1 = require("./vector2");
var Rectangle = /** @class */ (function () {
    function Rectangle(topLeft, bottomRight) {
        this._topLeft = topLeft;
        this._bottomRight = bottomRight;
    }
    Object.defineProperty(Rectangle.prototype, "topLeft", {
        get: function () {
            return this._topLeft;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "topRight", {
        get: function () {
            return new vector2_1.Vector2(this._bottomRight.x, this._topLeft.y);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "bottomLeft", {
        get: function () {
            return new vector2_1.Vector2(this._topLeft.x, this._bottomRight.y);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "bottomRight", {
        get: function () {
            return this._bottomRight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "center", {
        get: function () {
            return new vector2_1.Vector2((this._topLeft.x + this._bottomRight.x) / 2, (this._topLeft.y + this._bottomRight.y) / 2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "top", {
        get: function () {
            return this._topLeft.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "right", {
        get: function () {
            return this._bottomRight.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "bottom", {
        get: function () {
            return this._bottomRight.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "left", {
        get: function () {
            return this._topLeft.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "width", {
        get: function () {
            return Math.abs(this._bottomRight.x - this._topLeft.x);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "height", {
        get: function () {
            return Math.abs(this._topLeft.y - this._bottomRight.y);
        },
        enumerable: true,
        configurable: true
    });
    Rectangle.prototype.contains = function (rectangle) {
        return this.left <= rectangle.left &&
            this.bottom <= rectangle.bottom &&
            this.top >= rectangle.top &&
            this.right >= rectangle.right;
    };
    return Rectangle;
}());
exports.Rectangle = Rectangle;
//# sourceMappingURL=rectangle.js.map