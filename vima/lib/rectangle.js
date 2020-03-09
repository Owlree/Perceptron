"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vector2_1 = require("./vector2");
/**
 * A simple rectangle class.
 */
var Rectangle = /** @class */ (function () {
    function Rectangle(topLeft, bottomRight) {
        this._topLeft = topLeft;
        this._bottomRight = bottomRight;
    }
    Object.defineProperty(Rectangle.prototype, "topLeft", {
        /**
         * @returns The top left corner of the rectangle.
         */
        get: function () {
            return this._topLeft;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "topRight", {
        /**
         * @returns The top right corner of the rectangle.
         */
        get: function () {
            return new vector2_1.Vector2(this._bottomRight.x, this._topLeft.y);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "bottomLeft", {
        /**
         * @returns The bottom left corner of the rectangle.
         */
        get: function () {
            return new vector2_1.Vector2(this._topLeft.x, this._bottomRight.y);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "bottomRight", {
        /**
         * @returns The bottom right corner of the rectangle.
         */
        get: function () {
            return this._bottomRight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "center", {
        /**
         * @returns The center of the rectangle.
         */
        get: function () {
            return new vector2_1.Vector2((this._topLeft.x + this._bottomRight.x) / 2, (this._topLeft.y + this._bottomRight.y) / 2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "top", {
        /**
         * @returns The top y-coordinate of the rectangle.
         */
        get: function () {
            return this._topLeft.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "right", {
        /**
         * @returns The rigth x-coordinate of the rectangle.
         */
        get: function () {
            return this._bottomRight.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "bottom", {
        /**
         * @returns The bottom y-coordinate of the rectangle.
         */
        get: function () {
            return this._bottomRight.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "left", {
        /**
         * @returns The left x-coordinate of the rectangle.
         */
        get: function () {
            return this._topLeft.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "width", {
        /**
         * @returns The width of the rectangle (x-coordinate size).
         */
        get: function () {
            return Math.abs(this._bottomRight.x - this._topLeft.x);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "height", {
        /**
         * @returns The heighto f the rectangle (y-coordinate size).
         */
        get: function () {
            return Math.abs(this._topLeft.y - this._bottomRight.y);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param rectangle A rectangle
     * @returns Wether the given rectangle is contained in this rectangle.
     */
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