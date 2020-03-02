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
const writeablevariable_1 = require("./writeablevariable");
const pointgraphictype_1 = require("./pointgraphictype");
const vector2_1 = require("./vector2");
/**
 * Base abstract class representing a mathematical point. Handles the the
 * visual aspects of the graphic such as color and size. The position of the
 * point is left to deriving classes.
 */
class PointGraphic extends graphic_1.default {
    constructor({ color = Colors.mainColor, radius = 10, type = pointgraphictype_1.default.Circle, interactive = true } = {}) {
        super();
        this._colorVariable = undefined;
        this._radius = 1;
        this._rotation = 0;
        this._interactive = true;
        switch (type) {
            case pointgraphictype_1.default.Circle:
                this._path = new paper.Path.Circle({
                    center: new paper.Point(0.0, 0.0),
                    radius: radius,
                    insert: false
                });
                break;
            case pointgraphictype_1.default.Triangle:
                {
                    this._path.removeSegments();
                    const trianglePath = new paper.Path.RegularPolygon({
                        insert: false,
                        radius: radius,
                        sides: 3
                    });
                    this._path.addSegments(trianglePath.segments);
                    this._path.pivot = new paper.Point(0, 0);
                    this._path.closePath();
                    break;
                }
            default:
                // TODO (Owlree) Isn't there a better way to handle this case in TS?
                throw new Error(`No path was created for type ${pointgraphictype_1.default[type]}`);
        }
        this._path.applyMatrix = false;
        this.color = color;
        this.radius = radius;
        this._positionVariable = new writeablevariable_1.default(new vector2_1.default(0, 0));
        this._position = this._positionVariable;
        this.interactive = interactive;
    }
    set interactive(interactive) {
        if (this._interactive && !interactive) {
            this._path.strokeColor = this._path.fillColor;
            this._path.fillColor = this._path.strokeColor.add(0.33);
            this._path.strokeWidth = 2;
        }
        else if (!this._interactive && interactive) {
            this._path.fillColor = this._path.strokeColor;
            this._path.strokeColor = null;
            this._path.strokeWidth = 0;
        }
        this._interactive = interactive;
    }
    set color(color) {
        if (this._interactive) {
            this._path.fillColor = color;
            this._path.strokeColor = null;
        }
        else {
            this._path.strokeColor = color;
            this._path.fillColor = this._path.strokeColor.add(0.33);
        }
    }
    set radius(radius) {
        this._path.scale(1 / this._radius);
        this._path.scale(radius);
        this._radius = radius;
    }
    get radius() {
        return this._radius;
    }
    set rotation(rotation) {
        // TODO (Owlree) This method rotates the point graphic using screen
        // coordinates, but it is not clear from the name that it does so
        this._rotation = rotation * Math.PI / 180;
        this._rotation = rotation;
        // We can't rotate in screen space if we don't have a screen matrix
        if (this._screenMatrix === undefined) {
            console.warn('Could not screen rotate this object because it doesn\'t' +
                'know of the screen transform');
            return;
        }
        this._path.transform(this._screenMatrix);
        const oldRotation = this._path.rotation;
        this._path.rotate(rotation - oldRotation);
        this._path.transform(this._screenMatrix.inverted());
    }
    get rotation() {
        return this._rotation;
    }
    set _position(position) {
        const pv2 = position;
        this._path.position = new paper.Point(pv2.x, pv2.y);
    }
    get position() {
        return this._positionVariable.value;
    }
    set position(position) {
        this._positionVariable.value = position;
    }
    get positionVariable() {
        return this._positionVariable;
    }
    onScreenTransformUpdated(matrix) {
        const oldPosition = this._path.position;
        this._path.transform(this._path.matrix.inverted());
        this._path.rotate(this._rotation);
        this._path.transform(matrix.inverted());
        this._screenMatrix = matrix;
        this._path.position = oldPosition;
    }
}
__decorate([
    decoratorwatchvariable_1.default
], PointGraphic.prototype, "color", null);
__decorate([
    decoratorwatchvariable_1.default
], PointGraphic.prototype, "_position", null);
exports.default = PointGraphic;
//# sourceMappingURL=pointgraphic.js.map