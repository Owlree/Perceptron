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
var TextGraphic = /** @class */ (function (_super) {
    __extends(TextGraphic, _super);
    function TextGraphic(text, position, offset) {
        var _this = _super.call(this) || this;
        _this._offset = new vector2_1.Vector2(0, 0);
        _this._rotation = 0;
        _this._text = new paper.PointText({
            point: [0, 0],
            content: text,
            fillColor: 'black',
            fontFamily: 'Courier New',
            fontWeight: 'bold',
            fontSize: 24
        });
        _this.position = position;
        _this.offset = offset;
        return _this;
    }
    Object.defineProperty(TextGraphic.prototype, "rotation", {
        get: function () {
            return this._rotation;
        },
        set: function (rotation) {
            // TODO (Owlree) This method rotates the point graphic using screen
            // coordinates, but it is not clear from the name that it does so
            this._rotation = rotation;
            // We can't rotate in screen space if we don't have a screen matrix
            if (this._screenMatrix === undefined) {
                console.warn('Could not screen rotate this object because it doesn\'t' +
                    'know of the screen transform');
                return;
            }
            this._text.transform(this._screenMatrix);
            var a = new paper.Point(0, 0);
            var b = new paper.Point(1, Math.tan(this._rotation * Math.PI / 180));
            var sa = a.transform(this._screenMatrix);
            var sb = b.transform(this._screenMatrix);
            var angle = Math.atan2(sa.y - sb.y, sb.x - sa.x);
            this._text.rotation = -(angle * 180 / Math.PI);
            this._text.transform(this._screenMatrix.inverted());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextGraphic.prototype, "position", {
        set: function (position) {
            var pv2 = position;
            this._text.position = new paper.Point(pv2.x + this._offset.x, pv2.y + this._offset.y);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextGraphic.prototype, "offset", {
        set: function (offset) {
            this._text.position =
                new paper.Point(this._text.position.x - this._offset.x + offset.x, this._text.position.y - this._offset.y + offset.y);
            this._offset = offset;
        },
        enumerable: true,
        configurable: true
    });
    TextGraphic.prototype.onScreenTransformUpdated = function (matrix) {
        var oldPosition = this._text.position;
        this._text.transform(this._text.matrix.inverted());
        var a = new paper.Point(0, 0);
        var b = new paper.Point(1, Math.tan(this._rotation * Math.PI / 180));
        var sa = a.transform(matrix);
        var sb = b.transform(matrix);
        var angle = Math.atan2(sa.y - sb.y, sb.x - sa.x);
        this._text.rotation = -(angle * 180 / Math.PI);
        this._text.transform(matrix.inverted());
        this._screenMatrix = matrix;
        this._text.position = oldPosition;
    };
    __decorate([
        decoratorwatchvariable_1.DecoratorWatchVariable
    ], TextGraphic.prototype, "position", null);
    return TextGraphic;
}(graphic_1.Graphic));
exports.TextGraphic = TextGraphic;
//# sourceMappingURL=textgraphic.js.map