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
/**
 * Base abstract class representing a mathematical point. Handles the the
 * visual aspects of the graphic such as color and size. The position of the
 * point is left to deriving classes.
 */
var PointGraphic = /** @class */ (function (_super) {
    __extends(PointGraphic, _super);
    function PointGraphic(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.color, color = _c === void 0 ? Colors.mainColor : _c, _d = _b.radius, radius = _d === void 0 ? 10 : _d, _e = _b.type, type = _e === void 0 ? pointgraphictype_1.PointGraphicType.Circle : _e, _f = _b.interactive, interactive = _f === void 0 ? true : _f;
        var _this = _super.call(this) || this;
        _this._colorVariable = undefined;
        _this._radius = 1;
        _this._rotation = 0;
        _this._interactive = true;
        switch (type) {
            case pointgraphictype_1.PointGraphicType.Circle:
                _this._path = new paper.Path.Circle({
                    center: new paper.Point(0.0, 0.0),
                    radius: radius,
                    insert: false
                });
                break;
            case pointgraphictype_1.PointGraphicType.Triangle:
                {
                    _this._path.removeSegments();
                    var trianglePath = new paper.Path.RegularPolygon({
                        insert: false,
                        radius: radius,
                        sides: 3
                    });
                    _this._path.addSegments(trianglePath.segments);
                    _this._path.pivot = new paper.Point(0, 0);
                    _this._path.closePath();
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
        _this.interactive = interactive;
        return _this;
    }
    Object.defineProperty(PointGraphic.prototype, "interactive", {
        set: function (interactive) {
            if (this._interactive && !interactive) {
                this._path.strokeColor = this._path.fillColor;
                this._path.fillColor = this._path.strokeColor.add(0.33);
                this._path.strokeWidth = 2;
            }
            else if (!this._interactive && interactive) {
                this._path.fillColor = this._path.strokeColor;
                this._path.strokeColor = null;
                this._path.strokeWidth = 0;
            }
            this._interactive = interactive;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointGraphic.prototype, "color", {
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
        get: function () {
            return this._radius;
        },
        set: function (radius) {
            this._path.scale(1 / this._radius);
            this._path.scale(radius);
            this._radius = radius;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointGraphic.prototype, "rotation", {
        get: function () {
            return this._rotation;
        },
        set: function (rotation) {
            // TODO (Owlree) This method rotates the point graphic using screen
            // coordinates, but it is not clear from the name that it does so
            this._rotation = rotation * Math.PI / 180;
            this._rotation = rotation;
            // We can't rotate in screen space if we don't have a screen matrix
            if (this._screenMatrix === undefined) {
                console.warn('Could not screen rotate this object because it doesn\'t' +
                    'know of the screen transform');
                return;
            }
            this._path.transform(this._screenMatrix);
            var oldRotation = this._path.rotation;
            this._path.rotate(rotation - oldRotation);
            this._path.transform(this._screenMatrix.inverted());
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
        get: function () {
            return this._positionVariable.value;
        },
        set: function (position) {
            this._positionVariable.value = position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointGraphic.prototype, "positionVariable", {
        get: function () {
            return this._positionVariable;
        },
        enumerable: true,
        configurable: true
    });
    PointGraphic.prototype.onScreenTransformUpdated = function (matrix) {
        var oldPosition = this._path.position;
        this._path.transform(this._path.matrix.inverted());
        this._path.rotate(this._rotation);
        this._path.transform(matrix.inverted());
        this._screenMatrix = matrix;
        this._path.position = oldPosition;
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