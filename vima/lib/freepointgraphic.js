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
const paper = require("paper");
const Colors = require("./colors");
const pointgraphic_1 = require("./pointgraphic");
const vector2_1 = require("./vector2");
/**
 * Class that represents a free draggable point. Provides mouse interaction out
 * of the box.
 */
class FreePointGraphic extends pointgraphic_1.default {
    constructor(_a = {}) {
        var { x = 0, y = 0 } = _a, options = __rest(_a, ["x", "y"]);
        super(options);
        this._mouseDown = false;
        this._mouseOver = false;
        this._path.shadowColor = Colors.blueColor.value;
        this._path.shadowBlur = 0;
        this.position = new vector2_1.default(x, y);
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
                this.position = new vector2_1.default(event.point.x, event.point.y);
            }
        });
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
exports.default = FreePointGraphic;
//# sourceMappingURL=freepointgraphic.js.map