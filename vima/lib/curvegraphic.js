"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Colors = require("./colors");
const decoratorwatchvariable_1 = require("./decoratorwatchvariable");
const graphic_1 = require("./graphic");
/**
 * Abstract class for a curve graphic. Deals with all visual options. It can't
 * contain information about the actual object represented.
 */
class CurveGraphic extends graphic_1.default {
    constructor({ strokeColor = Colors.mainColor, strokeWidth = 0.01 } = {}) {
        super();
        this.vars = [];
        this._width = 0.01;
        this._colorVariable = undefined;
        this._colorVariableChangedCallback = undefined;
        this._path.strokeWidth = strokeWidth;
        this.color = strokeColor;
    }
    set color(color) {
        this._path.strokeColor = color;
    }
    set width(width) {
        this._width = width;
        if (this._path !== undefined) {
            this._path.strokeWidth = width;
        }
    }
}
__decorate([
    decoratorwatchvariable_1.default
], CurveGraphic.prototype, "color", null);
exports.default = CurveGraphic;
//# sourceMappingURL=curvegraphic.js.map