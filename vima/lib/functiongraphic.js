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
const parametriccurvegraphic_1 = require("./parametriccurvegraphic");
/**
 * Class that represents the graph of an one variable function.
 */
class FunctionGraphic extends parametriccurvegraphic_1.default {
    constructor(yFuncStr, _a = {}) {
        var { from = 0, to = 1, varStr = 'x', variables = {} } = _a, others = __rest(_a, ["from", "to", "varStr", "variables"]);
        super(varStr, yFuncStr, Object.assign({ from: from, to: to, variables: variables, varStr: varStr }, others));
    }
    onBoundsUpdated(bounds) {
        this._from = bounds.left;
        this._to = bounds.right;
        this.build();
    }
    yAtX(x) {
        return this.getY(x);
    }
}
exports.default = FunctionGraphic;
//# sourceMappingURL=functiongraphic.js.map