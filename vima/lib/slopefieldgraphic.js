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
// import * as math from 'mathjs';
var paper = require("paper");
var math = require("mathjs");
var Colors = require("./colors");
var graphic_1 = require("./graphic");
var decoratorwatchvariable_1 = require("./decoratorwatchvariable");
var vector2_1 = require("./vector2");
/**
 * A graphic that represents a slope field
 */
var SlopeField = /** @class */ (function (_super) {
    __extends(SlopeField, _super);
    function SlopeField(slopeFunctionStr, bounds) {
        var _this = _super.call(this) || this;
        _this._slopeFunction = math.parse(slopeFunctionStr).compile();
        _this._item = _this._group = new paper.Group();
        var hstep = Math.abs(bounds.left - bounds.right) / 25;
        var vstep = Math.abs(bounds.bottom - bounds.top) / 15;
        _this._slopeField = new paper.Group();
        for (var i = bounds.left; i <= bounds.right; i += hstep) {
            for (var j = bounds.bottom; j <= bounds.top; j += vstep) {
                var line = new paper.Path.Line(new paper.Point(i - 0.1, j), new paper.Point(i + 0.1, j));
                line.rotate(180 / Math.PI * Math.atan2(_this._slopeFunction.evaluate({ x: i, y: j }), 1));
                _this._slopeField.addChild(line);
            }
        }
        _this._slopeField.opacity = 0.5;
        _this._slopeField.strokeWidth = 0.005;
        _this._group.addChild(_this._slopeField);
        _this.color = Colors.mainColor;
        _this._solution = new paper.Path();
        _this._solution.strokeWidth = 0.02;
        _this._group.addChild(_this._solution);
        _this.solutionColor = Colors.redColor;
        return _this;
    }
    Object.defineProperty(SlopeField.prototype, "solutionPosition", {
        set: function (position_) {
            var position = position_;
            var segments = [new paper.Segment(position.array)];
            var current = new paper.Point(position.array);
            var prevAngle = undefined;
            for (var i = 0; i < 100; ++i) {
                var angle = Math.atan2(this._slopeFunction.evaluate({
                    x: current.x,
                    y: current.y
                }), 1);
                if (prevAngle !== undefined) {
                    if (angle < prevAngle) {
                        while (Math.abs(angle + Math.PI - prevAngle) < Math.abs(angle - prevAngle)) {
                            angle += Math.PI;
                        }
                    }
                    else if (angle > prevAngle) {
                        while (Math.abs(angle - Math.PI - prevAngle) < Math.abs(angle - prevAngle)) {
                            angle -= Math.PI;
                        }
                    }
                }
                var vector = new vector2_1.Vector2(Math.cos(angle) * 0.2, Math.sin(angle) * 0.2);
                prevAngle = angle;
                current = new paper.Point(current.x + vector.x, current.y + vector.y);
                segments.push(new paper.Segment(current));
                this._solution.removeSegments();
                this._solution.addSegments(segments);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SlopeField.prototype, "color", {
        set: function (color) {
            this._slopeField.strokeColor = color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SlopeField.prototype, "solutionColor", {
        set: function (color) {
            this._solution.strokeColor = color;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        decoratorwatchvariable_1.DecoratorWatchVariable
    ], SlopeField.prototype, "solutionPosition", null);
    __decorate([
        decoratorwatchvariable_1.DecoratorWatchVariable
    ], SlopeField.prototype, "color", null);
    __decorate([
        decoratorwatchvariable_1.DecoratorWatchVariable
    ], SlopeField.prototype, "solutionColor", null);
    return SlopeField;
}(graphic_1.Graphic));
exports.SlopeField = SlopeField;
//# sourceMappingURL=slopefieldgraphic.js.map