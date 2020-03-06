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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var paper = require("paper");
var Colors = require("./colors");
var pointgraphic_1 = require("./pointgraphic");
var vector2_1 = require("./vector2");
/**
 * Class that represents a free draggable point. Provides mouse interaction out
 * of the box.
 */
var FreePointGraphic = /** @class */ (function (_super) {
    __extends(FreePointGraphic, _super);
    function FreePointGraphic(_a) {
        if (_a === void 0) { _a = {}; }
        var _b = _a.x, x = _b === void 0 ? 0 : _b, _c = _a.y, y = _c === void 0 ? 0 : _c, _d = _a.interactive, interactive = _d === void 0 ? true : _d, options = __rest(_a, ["x", "y", "interactive"]);
        var _this = _super.call(this, __assign({ interactive: interactive }, options)) || this;
        _this._mouseDown = false;
        _this._mouseOver = false;
        _this._path.shadowColor = Colors.blueColor.value;
        _this._path.shadowBlur = 0;
        _this.position = new vector2_1.Vector2(x, y);
        if (interactive) {
            _this._path.on('mouseenter', function () {
                _this._mouseOver = true;
                _this.updateStyle();
            });
            _this._path.on('mouseleave', function () {
                _this._mouseOver = false;
                _this.updateStyle();
            });
            _this._path.on('mousedown', function () {
                _this._mouseDown = true;
                _this.updateStyle();
            });
            paper.view.on('mouseup', function () {
                _this._mouseDown = false;
                _this.updateStyle();
                return true;
            });
            paper.view.on('mousemove', function (event) {
                if (_this._mouseDown) {
                    _this.position = new vector2_1.Vector2(event.point.x, event.point.y);
                }
            });
        }
        return _this;
    }
    FreePointGraphic.prototype.updateStyle = function () {
        if (this._mouseDown) {
            this._path.shadowBlur = this.radius;
            document.body.style.cursor = 'grabbing';
        }
        else if (this._mouseOver) {
            this._path.shadowBlur = this.radius;
            document.body.style.cursor = 'grab';
        }
        else {
            this._path.shadowBlur = 0;
            document.body.style.cursor = '';
        }
    };
    return FreePointGraphic;
}(pointgraphic_1.PointGraphic));
exports.FreePointGraphic = FreePointGraphic;
//# sourceMappingURL=freepointgraphic.js.map