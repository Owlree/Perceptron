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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var pointgraphic_1 = require("./pointgraphic");
var vector2_1 = require("./vector2");
var decoratorwatchvariable_1 = require("./decoratorwatchvariable");
/**
 * Class that represents a point constrained to move along a
 * {@link FunctionGraphic}. Provides mouse interaction out of the
 * box. When the point is dragged, the abscissa of the mouse position is used
 * as input to the function to get the ordinate.
 */
var ConstrainedPointFunctionGraphic = /** @class */ (function (_super) {
    __extends(ConstrainedPointFunctionGraphic, _super);
    function ConstrainedPointFunctionGraphic(functionGraphic, _a) {
        if (_a === void 0) { _a = {}; }
        var _b = _a.x, x = _b === void 0 ? 0 : _b, _c = _a.interactive, interactive = _c === void 0 ? true : _c, options = __rest(_a, ["x", "interactive"]);
        var _this = _super.call(this, __assign({ interactive: interactive }, options)) || this;
        _this._mouseDown = false;
        _this._mouseOver = false;
        _this._functionGraphic = functionGraphic;
        _this.x = x;
        // This callback is to be called anytime the given function changes, so we
        // can update the ordinate of the point accordingly
        var functionChangedCallback = function () {
            var x = _this.position.x;
            var y = _this._functionGraphic.yAtX(x);
            _this.position = new vector2_1.Vector2(_this.position.x, y);
        };
        // TODO (Owlree) Should this be unregistered at some point?
        _this._functionGraphic.register(functionChangedCallback);
        if (interactive) {
            _this._item.on('mouseenter', function () {
                _this._mouseOver = true;
                _this.updateCursorStyle();
            });
            _this._item.on('mouseleave', function () {
                _this._mouseOver = false;
                _this.updateCursorStyle();
            });
            _this._item.on('mousedown', function () {
                _this._mouseDown = true;
                _this.updateCursorStyle();
            });
            paper.view.on('mouseup', function () {
                _this._mouseDown = false;
                _this.updateCursorStyle();
            });
            paper.view.on('mousemove', function (event) {
                if (_this._mouseDown) {
                    var x_1 = event.point.x;
                    var y = _this._functionGraphic.yAtX(x_1);
                    _this.position = new vector2_1.Vector2(x_1, y);
                }
            });
        }
        return _this;
    }
    Object.defineProperty(ConstrainedPointFunctionGraphic.prototype, "x", {
        /**
         * @param x The new abscissa of the point
         */
        set: function (x) {
            var xn = x;
            this.position = new vector2_1.Vector2(xn, this._functionGraphic.yAtX(xn));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates the cursor style based on what actions are performed on the object
     */
    ConstrainedPointFunctionGraphic.prototype.updateCursorStyle = function () {
        if (this._mouseDown) {
            paper.view.element.style.cursor = 'grabbing';
        }
        else if (this._mouseOver) {
            paper.view.element.style.cursor = 'grab';
        }
        else {
            paper.view.element.style.cursor = '';
        }
    };
    __decorate([
        decoratorwatchvariable_1.DecoratorWatchVariable
    ], ConstrainedPointFunctionGraphic.prototype, "x", null);
    return ConstrainedPointFunctionGraphic;
}(pointgraphic_1.PointGraphic));
exports.ConstrainedPointFunctionGraphic = ConstrainedPointFunctionGraphic;
//# sourceMappingURL=constrainedpointfunctiongraphic.js.map