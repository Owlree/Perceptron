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
        for (var i = bounds.left; i <= bounds.right; i += hstep) {
            for (var j = bounds.bottom; j <= bounds.top; j += vstep) {
                var line = new paper.Path.Line(new paper.Point(i - 0.1, j), new paper.Point(i + 0.1, j));
                line.rotate(180 / Math.PI * Math.atan2(_this._slopeFunction.evaluate({ x: i, y: j }), 1));
                _this._group.addChild(line);
            }
        }
        // let current = new paper.Point(0.5, 0.5);
        // const segments = [new paper.Segment(current)];
        // let prevAngle: number | undefined = undefined;
        // for (let i = 0; i < 500; ++i) {
        //   segments.push(new paper.Segment(current));
        //   const line = new paper.Path.Line(
        //     new paper.Point(current.x, current.y),
        //     new paper.Point(current.x + 0.05, current.y)
        //   );
        //   let angle = Math.atan2(this._slopeFunction.evaluate({x: current.x, y: current.y}), 1);
        //   if (prevAngle !== undefined) {
        //     if (angle < prevAngle) {
        //       while (Math.abs(angle + Math.PI - prevAngle) < Math.abs(angle - prevAngle)) {
        //         angle += Math.PI;
        //       }
        //     } else if (angle > prevAngle) {
        //       while (Math.abs(angle - Math.PI - prevAngle) < Math.abs(angle - prevAngle)) {
        //         angle -= Math.PI;
        //       }
        //     }
        //   }
        //   line.rotate(180 / Math.PI * angle);
        //   const vec = new Vector2(
        //     Math.cos(angle) * 0.1,
        //     Math.sin(angle) * 0.1
        //   );
        //   prevAngle = angle;
        //   current = new paper.Point(current.x + vec.x, current.y + vec.y);
        //   this._group.addChild(line);
        // }
        // const line = new paper.Path.Line(
        //   new paper.Point(bounds.left, 0),
        //   new paper.Point(bounds.right, 0)
        // );
        // this._group.addChild(line);
        _this._group.strokeWidth = 0.005;
        _this.color = Colors.mainColor;
        return _this;
    }
    Object.defineProperty(SlopeField.prototype, "color", {
        set: function (color) {
            this._group.strokeColor = color;
            this._group.opacity = 0.5;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        decoratorwatchvariable_1.DecoratorWatchVariable
    ], SlopeField.prototype, "color", null);
    return SlopeField;
}(graphic_1.Graphic));
exports.SlopeField = SlopeField;
//# sourceMappingURL=slopefieldgraphic.js.map