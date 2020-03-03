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
var Colors = require("./colors");
var decoratorwatchvariable_1 = require("./decoratorwatchvariable");
var graphic_1 = require("./graphic");
/**
 * Abstract class for a curve graphic. Deals with all visual options. It can't
 * contain information about the actual object represented.
 */
var CurveGraphic = /** @class */ (function (_super) {
    __extends(CurveGraphic, _super);
    function CurveGraphic(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.strokeColor, strokeColor = _c === void 0 ? Colors.mainColor : _c, _d = _b.strokeWidth, strokeWidth = _d === void 0 ? 0.01 : _d;
        var _this = _super.call(this) || this;
        _this.vars = [];
        _this._width = 0.01;
        _this._colorVariable = undefined;
        _this._colorVariableChangedCallback = undefined;
        _this._path.strokeWidth = strokeWidth;
        _this.color = strokeColor;
        return _this;
    }
    Object.defineProperty(CurveGraphic.prototype, "color", {
        set: function (color) {
            this._path.strokeColor = color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CurveGraphic.prototype, "width", {
        set: function (width) {
            this._width = width;
            if (this._path !== undefined) {
                this._path.strokeWidth = width;
            }
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        decoratorwatchvariable_1.DecoratorWatchVariable
    ], CurveGraphic.prototype, "color", null);
    return CurveGraphic;
}(graphic_1.Graphic));
exports.CurveGraphic = CurveGraphic;
//# sourceMappingURL=curvegraphic.js.map