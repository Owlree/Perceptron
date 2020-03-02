"use strict";
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
const math = require("mathjs");
const paper = require("paper");
const curvegraphic_1 = require("./curvegraphic");
const variable_1 = require("./variable");
const mixinvariable_1 = require("./mixinvariable");
const applymixins_1 = require("./applymixins");
/**
 * Class that represents a parametric curve graphic. Store data about the
 * mathematical functions that describe the curve. Visual information is store
 * in the parent class, {@link CurveGraphic}.
 */
class ParametricCurveGraphic extends curvegraphic_1.default {
    constructor(xFuncStr, yFuncStr, _a = {}) {
        var { from = 0, to = 1, variables = {}, varStr = 'x' } = _a, options = __rest(_a, ["from", "to", "variables", "varStr"]);
        super(options);
        this._from = 0;
        this._to = 1;
        this._xfn = undefined;
        this._yfn = undefined;
        this._varStr = 'x';
        this._variables = {};
        // Compile math functions
        this._xfn = math.parse(xFuncStr).compile();
        this._yfn = math.parse(yFuncStr).compile();
        // Set necessary options
        [this._varStr, this._from, this._to, this._variables] =
            [varStr, from, to, variables];
        // Register self as a subscriber to changing variables
        for (let key in this._variables) {
            const variable = this._variables[key];
            if (variable instanceof variable_1.default) {
                // Rebuild the graphic when a variable changes value
                variable.register(() => {
                    this.build();
                });
            }
        }
        this.build();
    }
    getX(i) {
        if (this._xfn !== undefined) {
            const scope = this.getScope();
            scope[this._varStr] = i;
            return this._xfn.evaluate(scope);
        }
        else {
            throw new Error('Missing x coordinate function');
        }
    }
    /**
     * Computes all the points in the curve path based on {@code this._xfn} and
     * {@code this._yfn}.
     */
    build() {
        this._path.removeSegments();
        for (let i = this._from; i <= this._to; i += 0.1) {
            const point = new paper.Point(this.getX(i), this.getY(i));
            const segment = new paper.Segment(point);
            this._path.add(segment);
        }
        const point = new paper.Point(this.getX(this._to), this.getY(this._to));
        const segment = new paper.Segment(point);
        this._path.add(segment);
        this.notify();
    }
    getY(i) {
        if (this._yfn !== undefined) {
            const scope = this.getScope();
            scope[this._varStr] = i;
            return this._yfn.evaluate(scope);
        }
        else {
            throw new Error('Missing y coordinate function');
        }
    }
    /**
     * @returns The scope containing the current values of the all the current
     * values
     */
    getScope() {
        let scope = {};
        for (let key in this._variables) {
            const variable = this._variables[key];
            if (variable instanceof variable_1.default) {
                scope[key] = variable.value;
            }
            else {
                scope[key] = variable;
            }
        }
        return scope;
    }
}
applymixins_1.default(ParametricCurveGraphic, [mixinvariable_1.default]);
exports.default = ParametricCurveGraphic;
//# sourceMappingURL=parametriccurvegraphic.js.map