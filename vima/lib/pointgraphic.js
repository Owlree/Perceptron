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
var writablevariable_1 = require("./writablevariable");
var pointgraphictype_1 = require("./pointgraphictype");
var vector2_1 = require("./vector2");
var rectangle_1 = require("./rectangle");
/**
 * Base abstract class representing a mathematical point. Handles the the
 * visual aspects of the graphic such as color and size. The position of the
 * point is left to deriving classes.
 */
var PointGraphic = /** @class */ (function (_super) {
    __extends(PointGraphic, _super);
    function PointGraphic(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.color, color = _c === void 0 ? Colors.mainColor : _c, _d = _b.radius, radius = _d === void 0 ? 10 : _d, _e = _b.type, type = _e === void 0 ? pointgraphictype_1.PointGraphicType.Circle : _e;
        var _this = _super.call(this) || this;
        _this._interactive = true;
        _this._radius = 1;
        _this._rotation = 0;
        switch (type) {
            case pointgraphictype_1.PointGraphicType.Circle:
                _this._item = _this._path = new paper.Path.Circle({
                    center: new paper.Point(0.0, 0.0),
                    radius: radius,
                    insert: false
                });
                break;
            case pointgraphictype_1.PointGraphicType.Triangle:
                {
                    _this._item = _this._path = new paper.Path.RegularPolygon({
                        insert: false,
                        radius: radius,
                        sides: 3
                    });
                    _this._path.pivot = new paper.Point(0, 0);
                    break;
                }
            default:
                // TODO (Owlree) Isn't there a better way to handle this case in TS?
                throw new Error("No path was created for type " + pointgraphictype_1.PointGraphicType[type]);
        }
        _this._path.applyMatrix = false;
        _this.color = color;
        _this.radius = radius;
        _this._positionVariable = new writablevariable_1.WritableVariable(new vector2_1.Vector2(0, 0));
        _this._position = _this._positionVariable;
        return _this;
    }
    Object.defineProperty(PointGraphic.prototype, "color", {
        /**
         * @param color The new color of the point graphic.
         */
        set: function (color) {
            if (this._interactive) {
                this._path.fillColor = color;
                this._path.strokeColor = null;
            }
            else {
                this._path.strokeColor = color;
                this._path.fillColor = this._path.strokeColor.add(0.33);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointGraphic.prototype, "radius", {
        /**
         * @returns The radius of the point graphic
         */
        get: function () {
            return this._radius;
        },
        /**
         * @param radius The new radius of the point graphic
         */
        set: function (radius) {
            this._path.scale(1 / this._radius);
            this._path.scale(radius);
            this._radius = radius;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointGraphic.prototype, "rotation", {
        /**
         * @returns The rotation of the point graphic
         */
        get: function () {
            return this._rotation;
        },
        /**
         * @param rotation The new rotation of the point graphic
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
            var sa = a.transform(this._screenMatrix.inverted());
            var sb = b.transform(this._screenMatrix.inverted());
            var angle = Math.atan2(sb.y - sa.y, sb.x - sa.x);
            this._item.rotation = angle * 180 / Math.PI;
            this._item.transform(this._screenMatrix.inverted());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointGraphic.prototype, "_position", {
        set: function (position) {
            var pv2 = position;
            this._path.position = new paper.Point(pv2.x, pv2.y);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointGraphic.prototype, "position", {
        /**
         * @returns The position of the point.
         */
        get: function () {
            return this._positionVariable.value;
        },
        /**
         * @param position The new position of the point.
         */
        set: function (position) {
            this._positionVariable.value = position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointGraphic.prototype, "positionVariable", {
        /**
         * @returns A variable in sync with the position of the point.
         */
        get: function () {
            return this._positionVariable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointGraphic.prototype, "bounds", {
        /**
         * @returns The bounds of the point graphic.
         */
        get: function () {
            return new rectangle_1.Rectangle(new vector2_1.Vector2(this._item.bounds.bottomLeft.x, this._item.bounds.bottomLeft.y), new vector2_1.Vector2(this._item.bounds.topRight.x, this._item.bounds.topRight.y));
        },
        enumerable: true,
        configurable: true
    });
    PointGraphic.prototype.onScreenTransformUpdated = function (matrix) {
        var oldPosition = this._item.position;
        this._item.transform(this._item.matrix.inverted());
        var a = new paper.Point(0, 0);
        var b = new paper.Point(Math.cos(this._rotation * Math.PI / 180), Math.sin(this._rotation * Math.PI / 180));
        var sa = a.transform(matrix.inverted());
        var sb = b.transform(matrix.inverted());
        var angle = Math.atan2(sb.y - sa.y, sb.x - sa.x);
        this._item.rotation = angle * 180 / Math.PI;
        this._item.transform(matrix.inverted());
        this._screenMatrix = matrix;
        this._item.position = oldPosition;
    };
    __decorate([
        decoratorwatchvariable_1.DecoratorWatchVariable
    ], PointGraphic.prototype, "color", null);
    __decorate([
        decoratorwatchvariable_1.DecoratorWatchVariable
    ], PointGraphic.prototype, "_position", null);
    return PointGraphic;
}(graphic_1.Graphic));
exports.PointGraphic = PointGraphic;
//# sourceMappingURL=pointgraphic.js.map