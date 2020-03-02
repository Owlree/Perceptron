"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paper = require("paper");
const Colors = require("./colors");
const variable_1 = require("./variable");
/**
 * A graphic calculator handles the presentation and interaction with various
 * graphics such as {@link CurveGraphic}, {@link FunctionGraphic},
 * {@link FreePointGraphic}, or others.
 */
class GraphingCalculator {
    constructor(canvasId) {
        this._backgroundColorVariable = undefined;
        this._bounds = new paper.Rectangle(new paper.Point(-Math.PI, -1.5), new paper.Point(Math.PI, 1.5));
        this._graphics = [];
        paper.setup(canvasId);
        this._backgroundPath = new paper.Path.Rectangle(this._bounds);
        this.backgroundColor = Colors.backgroundColor;
        paper.view.on('resize', () => {
            this.setup();
        });
        this.setup();
    }
    set bounds(bounds) {
        this._bounds = bounds;
        this._backgroundPath.bounds = bounds;
        this.setup();
        // Notify the bounds update on all objects that implement the subscriber
        // interface
        for (let graphic of this._graphics) {
            const updateable = graphic;
            if (updateable !== undefined) {
                updateable.onBoundsUpdated(this._bounds);
            }
        }
    }
    set backgroundColor(color) {
        if (this._backgroundColorVariable !== undefined &&
            this._backgroundColorVariableChangedCallback !== undefined) {
            this._backgroundColorVariable.unregister(this._backgroundColorVariableChangedCallback);
            this._backgroundColorVariable = undefined;
            this._backgroundColorVariableChangedCallback = undefined;
        }
        if (color instanceof variable_1.default) {
            this._backgroundPath.fillColor = color.value;
            this._backgroundColorVariable = color;
            this._backgroundColorVariableChangedCallback =
                (variable) => {
                    this._backgroundPath.fillColor = variable.value;
                };
            this._backgroundColorVariable.register(this._backgroundColorVariableChangedCallback);
        }
        else {
            this._backgroundPath.fillColor = color;
        }
    }
    add(graphic) {
        const graphicAny = graphic;
        if ('onBoundsUpdated' in graphicAny) {
            const updateable = graphicAny;
            updateable.onBoundsUpdated(this._bounds);
        }
        if ('onScreenTransformUpdated' in graphicAny) {
            const updateable = graphicAny;
            updateable.onScreenTransformUpdated(paper.view.matrix);
        }
        this._graphics.push(graphic);
        graphic.addTo(paper.project);
    }
    remove(graphic) {
        const index = this._graphics.indexOf(graphic);
        if (index > -1) {
            this._graphics[index].remove();
            this._graphics.splice(index, 1);
        }
    }
    setup() {
        // Revert the previous transform
        paper.view.transform(paper.view.matrix.inverted());
        // Apply the new transform
        paper.view.transform(new paper.Matrix(paper.view.viewSize.width / this._bounds.width, 0, 0, -paper.view.viewSize.height / this._bounds.height, paper.view.viewSize.width / 2, paper.view.viewSize.height / 2));
        paper.view.transform(new paper.Matrix(1, 0, 0, 1, -this._bounds.center.x, -this._bounds.center.y));
        // Notify all screen transform subscribers of the change
        for (let graphic of this._graphics) {
            const graphicAny = graphic;
            if ('onScreenTransformUpdated' in graphicAny) {
                const updateable = graphicAny;
                updateable.onScreenTransformUpdated(paper.view.matrix);
            }
        }
    }
}
exports.default = GraphingCalculator;
//# sourceMappingURL=graphingcalculator.js.map