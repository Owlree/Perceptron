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
var parametriccurvegraphic_1 = require("./parametriccurvegraphic");
var vector2_1 = require("./vector2");
/**
 * Class that represents the graph of an one variable function.
 */
var FunctionGraphic = /** @class */ (function (_super) {
    __extends(FunctionGraphic, _super);
    function FunctionGraphic(yFuncStr, _a) {
        if (_a === void 0) { _a = {}; }
        var _b = _a.from, from = _b === void 0 ? 0 : _b, _c = _a.to, to = _c === void 0 ? 1 : _c, _d = _a.varStr, varStr = _d === void 0 ? 'x' : _d, _e = _a.variables, variables = _e === void 0 ? {} : _e, others = __rest(_a, ["from", "to", "varStr", "variables"]);
        return _super.call(this, varStr, yFuncStr, __assign({ from: from, to: to, variables: variables, varStr: varStr }, others)) || this;
    }
    FunctionGraphic.prototype.onBoundsUpdated = function (bounds) {
        this._from = bounds.left;
        this._to = bounds.right;
        this.build();
    };
    /**
     * Returns the y-coordinate given the x-coordinate.
     * @param x The x coordinate
     */
    FunctionGraphic.prototype.yAtX = function (x) {
        return this.getY(x);
    };
    /**
     * Returns a {@link Vector2} point at coordinates given by the x-coordinate.
     * @param x The x-coordinate
     */
    FunctionGraphic.prototype.pointAtX = function (x) {
        return new vector2_1.Vector2(x, this.getY(x));
    };
    return FunctionGraphic;
}(parametriccurvegraphic_1.ParametricCurveGraphic));
exports.FunctionGraphic = FunctionGraphic;
//# sourceMappingURL=functiongraphic.js.map