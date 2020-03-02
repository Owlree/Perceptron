"use strict";
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
const paper = require("paper");
const pointgraphic_1 = require("./pointgraphic");
const vector2_1 = require("./vector2");
const decoratorwatchvariable_1 = require("./decoratorwatchvariable");
/**
 * Class that represents a point constrained to move along a
 * {@link FunctionGraphic}. Provides mouse interaction out of the
 * box. When the point is dragged, the abscissa of the mouse position is used
 * as input to the function to get the ordinate.
 */
class ConstrainedPointFunctionGraphic extends pointgraphic_1.default {
    constructor(functionGraphic, _a = {}) {
        var { x = 0, interactive = true } = _a, options = __rest(_a, ["x", "interactive"]);
        super(Object.assign({ interactive: interactive }, options));
        this._mouseDown = false;
        this._mouseOver = false;
        this._functionGraphic = functionGraphic;
        const functionChangedCallback = () => {
            const x = this.position.x;
            const y = this._functionGraphic.yAtX(x);
            this.position = new vector2_1.default(this.position.x, y);
        };
        this.x = x;
        // TODO (Owlree) Should this be unregistered at some point?
        this._functionGraphic.register(functionChangedCallback);
        this._path.shadowColor = new paper.Color('salmon');
        this._path.shadowBlur = 0;
        if (interactive) {
            this._path.on('mouseenter', () => {
                this._mouseOver = true;
                this.updateStyle();
            });
            this._path.on('mouseleave', () => {
                this._mouseOver = false;
                this.updateStyle();
            });
            this._path.on('mousedown', () => {
                this._mouseDown = true;
                this.updateStyle();
            });
            paper.view.on('mouseup', () => {
                this._mouseDown = false;
                this.updateStyle();
            });
            paper.view.on('mousemove', (event) => {
                if (this._mouseDown) {
                    const x = event.point.x;
                    const y = this._functionGraphic.yAtX(x);
                    this.position = new vector2_1.default(x, y);
                }
            });
        }
    }
    set x(x) {
        const xn = x;
        this.position = new vector2_1.default(xn, this._functionGraphic.yAtX(xn));
    }
    updateStyle() {
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
    }
}
__decorate([
    decoratorwatchvariable_1.default
], ConstrainedPointFunctionGraphic.prototype, "x", null);
exports.default = ConstrainedPointFunctionGraphic;
//# sourceMappingURL=constrainedpointfunctiongraphic.js.map