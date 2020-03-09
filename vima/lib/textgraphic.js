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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var paper = require("paper");
var decoratorwatchvariable_1 = require("./decoratorwatchvariable");
var graphic_1 = require("./graphic");
var vector2_1 = require("./vector2");
var _1 = require(".");
/**
 * Represents a text that can be added to {@link GraphingCalculator}, most
 * often as label.
 */
var TextGraphic = /** @class */ (function (_super) {
    __extends(TextGraphic, _super);
    function TextGraphic(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.color, color = _c === void 0 ? _1.Colors.mainColor : _c, _d = _b.content, content = _d === void 0 ? '' : _d, fontFamily = _b.fontFamily, _e = _b.fontSize, fontSize = _e === void 0 ? 20 : _e, fontWeight = _b.fontWeight, _f = _b.offset, offset = _f === void 0 ? new vector2_1.Vector2(0, 0) : _f, _g = _b.position, position = _g === void 0 ? new vector2_1.Vector2(0, 0) : _g;
        var _this = _super.call(this) || this;
        _this._offset = new vector2_1.Vector2(0, 0);
        _this._rotation = 0;
        _this._text = _this._item = new paper.PointText({
            content: content,
            fontFamily: fontFamily,
            fontSize: fontSize,
            fontWeight: fontWeight,
            insert: false,
            point: [0, 0]
        });
        _this.color = color;
        _this.offset = offset;
        _this.position = position;
        return _this;
    }
    Object.defineProperty(TextGraphic.prototype, "rotation", {
        /**
         * @returns The rotation of the text
         */
        get: function () {
            return this._rotation;
        },
        /**
         * @param rotation The new rotation of the text
         */
        set: function (rotation) {
            this._rotation = rotation;
            if (this._screenMatrix === undefined) {
                console.warn('Could not screen rotate this object because it doesn\'t' +
                    'know of the screen transform');
                return;
            }
            this._item.transform(this._screenMatrix);
            var a = new paper.Point(0, 0);
            var b = new paper.Point(Math.cos(this._rotation * Math.PI / 180), Math.sin(this._rotation * Math.PI / 180));
            var sa = a.transform(this._screenMatrix);
            var sb = b.transform(this._screenMatrix);
            var angle = Math.atan2(sb.y - sa.y, sb.x - sa.x);
            this._item.rotation = angle * 180 / Math.PI;
            this._item.transform(this._screenMatrix.inverted());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextGraphic.prototype, "position", {
        /**
         * @param position The new position of the text
         */
        set: function (position) {
            var pv2 = position;
            this._text.position = new paper.Point(pv2.x + this._offset.x, pv2.y + this._offset.y);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextGraphic.prototype, "offset", {
        /**
         * Sets the offset of the text. The final position on the canvas is calculed
         * by add the offset to the position.
         * @param offset The new offset of the text
         */
        set: function (offset) {
            var ov2 = offset;
            this._text.position =
                new paper.Point(this._text.position.x - this._offset.x + ov2.x, this._text.position.y - this._offset.y + ov2.y);
            this._offset = ov2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextGraphic.prototype, "color", {
        /**
         * @param color The new color of the text
         */
        set: function (color) {
            this._text.fillColor = color;
        },
        enumerable: true,
        configurable: true
    });
    TextGraphic.prototype.onScreenTransformUpdated = function (matrix) {
        var oldPosition = this._item.position;
        this._item.transform(this._item.matrix.inverted());
        var a = new paper.Point(0, 0);
        var b = new paper.Point(Math.cos(this._rotation * Math.PI / 180), Math.sin(this._rotation * Math.PI / 180));
        var sa = a.transform(matrix);
        var sb = b.transform(matrix);
        var angle = Math.atan2(sb.y - sa.y, sb.x - sa.x);
        this._item.rotation = angle * 180 / Math.PI;
        this._item.transform(matrix.inverted());
        this._screenMatrix = matrix;
        this._item.position = oldPosition;
    };
    __decorate([
        decoratorwatchvariable_1.DecoratorWatchVariable
    ], TextGraphic.prototype, "position", null);
    __decorate([
        decoratorwatchvariable_1.DecoratorWatchVariable
    ], TextGraphic.prototype, "offset", null);
    __decorate([
        decoratorwatchvariable_1.DecoratorWatchVariable
    ], TextGraphic.prototype, "color", null);
    return TextGraphic;
}(graphic_1.Graphic));
exports.TextGraphic = TextGraphic;
//# sourceMappingURL=textgraphic.js.map