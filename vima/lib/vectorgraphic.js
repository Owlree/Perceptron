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
var Colors = require("./colors");
var decoratorwatchvariable_1 = require("./decoratorwatchvariable");
var graphic_1 = require("./graphic");
var vector2_1 = require("./vector2");
/**
 * Class that represents the graphic of a two-dimensional vector.
 */
var VectorGraphic = /** @class */ (function (_super) {
    __extends(VectorGraphic, _super);
    // TODO (Owlree) Add more overloads
    function VectorGraphic(point1, point2, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.color, color = _c === void 0 ? Colors.mainColor : _c, _d = _b.strokeWidth, strokeWidth = _d === void 0 ? 0.01 : _d;
        var _this = _super.call(this) || this;
        _this._group = _this._item = new paper.Group({ insert: false });
        _this._segment = new paper.Path({
            insert: false,
            strokeWidth: strokeWidth,
            applyMatrix: false,
            strokeColor: color
        });
        _this._group.addChild(_this._segment);
        if (point2 !== undefined) { // Create a vector from point1 to point2
            _this._toPoint = point2; // Keep e reference to this point to rotate it
            _this._v1 = point1.position;
            _this._v2 = point2.position;
            point1.positionVariable.register(function (variable) {
                _this._v1 = variable.value;
                _this._build();
            });
            point2.positionVariable.register(function (variable) {
                _this._v2 = variable.value;
                _this._build();
            });
        }
        else { // Create a vector from (0, 0) to point1
            _this._toPoint = point1; // Keep e reference to this point to rotate it
            point1.positionVariable.register(function (variable) {
                _this._v2 = variable.value;
                _this._build();
            });
            _this._v1 = new vector2_1.Vector2(0, 0);
            _this._v2 = point1.position;
        }
        _this._segment.addSegments([
            new paper.Segment(_this._v1.array),
            new paper.Segment(_this._v2.array)
        ]);
        _this._build();
        // Save the color variable
        _this.color = color;
        return _this;
    }
    Object.defineProperty(VectorGraphic.prototype, "color", {
        /**
         * @param color The new color of the vector
         */
        set: function (color) {
            this._segment.strokeColor = color;
        },
        enumerable: true,
        configurable: true
    });
    VectorGraphic.prototype.onScreenTransformUpdated = function (matrix) {
        this._screenMatrix = matrix;
        this._build();
    };
    VectorGraphic.prototype._build = function () {
        var a = new paper.Point(this._v1.x, this._v1.y);
        var b = new paper.Point(this._v2.x, this._v2.y);
        this._segment.segments[0].point.x = this._v1.x;
        this._segment.segments[0].point.y = this._v1.y;
        this._segment.segments[1].point.x = this._v2.x;
        this._segment.segments[1].point.y = this._v2.y;
        if (this._screenMatrix !== undefined) {
            var angle = Math.atan2(b.y - a.y, b.x - a.x);
            this._toPoint.rotation = angle * 180 / Math.PI - 90;
        }
    };
    Object.defineProperty(VectorGraphic.prototype, "vector2", {
        /**
         * @returns The vector value represented by the graphic
         */
        get: function () {
            return new vector2_1.Vector2(this._v2.x - this._v1.x, this._v2.y - this._v1.y);
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        decoratorwatchvariable_1.DecoratorWatchVariable
    ], VectorGraphic.prototype, "color", null);
    return VectorGraphic;
}(graphic_1.Graphic));
exports.VectorGraphic = VectorGraphic;
//# sourceMappingURL=vectorgraphic.js.map