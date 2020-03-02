"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const paper = require("paper");
const Colors = require("./colors");
const decoratorwatchvariable_1 = require("./decoratorwatchvariable");
const graphic_1 = require("./graphic");
const vector2_1 = require("./vector2");
/**
 * Class that represents the graphic of a two-dimensional vector.
 */
class VectorGraphic extends graphic_1.default {
    constructor(point1, point2, { color = Colors.mainColor, strokeWidth = 0.01 } = {}) {
        super();
        this._segment = new paper.Path({
            insert: false,
            strokeWidth: strokeWidth,
            applyMatrix: false,
            strokeColor: color,
        });
        this._group.addChild(this._segment);
        if (point2 !== undefined) { // Create a vector from point1 to point2
            this._toPoint = point2; // Keep e reference to this point to rotate it
            this._v1 = point1.position;
            this._v2 = point2.position;
            point1.positionVariable.register((variable) => {
                this._v1 = variable.value;
                this._build();
            });
            point2.positionVariable.register((variable) => {
                this._v2 = variable.value;
                this._build();
            });
        }
        else { // Create a vector from (0, 0) to point1
            this._toPoint = point1; // Keep e reference to this point to rotate it
            point1.positionVariable.register((variable) => {
                this._v2 = variable.value;
                this._build();
            });
            this._v1 = new vector2_1.default(0, 0);
            this._v2 = point1.position;
        }
        this._build();
        this.color = color;
    }
    set color(color) {
        this._segment.strokeColor = color;
    }
    onScreenTransformUpdated(matrix) {
        this._screenMatrix = matrix;
        this._build();
    }
    _build() {
        const a = new paper.Point(this._v1.x, this._v1.y);
        const b = new paper.Point(this._v2.x, this._v2.y);
        this._segment.removeSegments();
        this._segment.addSegments([new paper.Segment(a), new paper.Segment(b)]);
        if (this._screenMatrix !== undefined) {
            // Rotate the 'to' point to match the direction of the vector in screen
            // coordinates
            const sa = a.transform(this._screenMatrix);
            const sb = b.transform(this._screenMatrix);
            const angle = Math.atan2(sa.y - sb.y, sb.x - sa.x);
            this._toPoint.rotation = -(270 + angle * 180 / Math.PI);
        }
    }
}
__decorate([
    decoratorwatchvariable_1.default
], VectorGraphic.prototype, "color", null);
exports.default = VectorGraphic;
//# sourceMappingURL=vectorgraphic.js.map