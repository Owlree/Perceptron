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
var math = require("mathjs");
var paper = require("paper");
var curvegraphic_1 = require("./curvegraphic");
var variable_1 = require("./variable");
var mixinvariable_1 = require("./mixinvariable");
var applymixins_1 = require("./applymixins");
/**
 * Class that represents a parametric curve graphic. Store data about the
 * mathematical functions that describe the curve. Visual information is store
 * in the parent class, {@link CurveGraphic}.
 */
var ParametricCurveGraphic = /** @class */ (function (_super) {
    __extends(ParametricCurveGraphic, _super);
    function ParametricCurveGraphic(xFuncStr, yFuncStr, _a) {
        var _b;
        if (_a === void 0) { _a = {}; }
        var _c = _a.from, from = _c === void 0 ? 0 : _c, _d = _a.to, to = _d === void 0 ? 1 : _d, _e = _a.variables, variables = _e === void 0 ? {} : _e, _f = _a.varStr, varStr = _f === void 0 ? 'x' : _f, options = __rest(_a, ["from", "to", "variables", "varStr"]);
        var _this = _super.call(this, options) || this;
        _this._from = 0;
        _this._to = 1;
        _this._varStr = 'x';
        _this._variables = {};
        // Compile math functions
        _this._xfn = math.parse(xFuncStr).compile();
        _this._yfn = math.parse(yFuncStr).compile();
        // Set necessary options
        _b = [varStr, from, to, variables], _this._varStr = _b[0], _this._from = _b[1], _this._to = _b[2], _this._variables = _b[3];
        // Register self as a subscriber to changing variables
        for (var key in _this._variables) {
            var variable = _this._variables[key];
            if (variable instanceof variable_1.Variable) {
                // Rebuild the graphic when a variable changes value
                variable.register(function () {
                    _this.build();
                });
            }
        }
        _this.build();
        return _this;
    }
    /**
     * Returns the x-coordinate for the given parameter
     * @param i The parameter to use
     */
    ParametricCurveGraphic.prototype.getX = function (i) {
        var scope = this.getScope();
        scope[this._varStr] = i;
        return this._xfn.evaluate(scope);
    };
    /**
     * Returns the y-coordinate for the given parameter
     * @param i The parameter to use
     */
    ParametricCurveGraphic.prototype.getY = function (i) {
        var scope = this.getScope();
        scope[this._varStr] = i;
        return this._yfn.evaluate(scope);
    };
    /**
     * Computes all the points in the curve path based on {@code this._xfn} and
     * {@code this._yfn}.
     */
    ParametricCurveGraphic.prototype.build = function () {
        this._path.removeSegments();
        for (var i = this._from; i <= this._to; i += 0.1) {
            var point_1 = new paper.Point(this.getX(i), this.getY(i));
            var segment_1 = new paper.Segment(point_1);
            this._path.add(segment_1);
        }
        var point = new paper.Point(this.getX(this._to), this.getY(this._to));
        var segment = new paper.Segment(point);
        this._path.add(segment);
        this.notify();
    };
    /**
     * @returns The scope containing the current values of the all the current
     * values
     */
    ParametricCurveGraphic.prototype.getScope = function () {
        var scope = {};
        for (var key in this._variables) {
            var variable = this._variables[key];
            if (variable instanceof variable_1.Variable) {
                scope[key] = variable.value;
            }
            else {
                scope[key] = variable;
            }
        }
        return scope;
    };
    return ParametricCurveGraphic;
}(curvegraphic_1.CurveGraphic));
exports.ParametricCurveGraphic = ParametricCurveGraphic;
applymixins_1.applyMixins(ParametricCurveGraphic, [mixinvariable_1.MixinVariable]);
//# sourceMappingURL=parametriccurvegraphic.js.map