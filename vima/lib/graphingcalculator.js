"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var paper = require("paper");
var Colors = require("./colors");
var variable_1 = require("./variable");
/**
 * A graphic calculator handles the presentation and interaction with various
 * graphics such as {@link CurveGraphic}, {@link FunctionGraphic},
 * {@link FreePointGraphic}, or others.
 */
var GraphingCalculator = /** @class */ (function () {
    function GraphingCalculator(canvasId) {
        var _this = this;
        this._backgroundColorVariable = undefined;
        this._bounds = new paper.Rectangle(new paper.Point(-Math.PI, -1.5), new paper.Point(Math.PI, 1.5));
        this._graphics = [];
        paper.setup(canvasId);
        this._backgroundPath = new paper.Path.Rectangle(this._bounds);
        this.backgroundColor = Colors.backgroundColor;
        paper.view.on('resize', function () {
            _this.setup();
        });
        this.setup();
    }
    Object.defineProperty(GraphingCalculator.prototype, "bounds", {
        set: function (bounds) {
            this._bounds = bounds;
            this._backgroundPath.bounds = bounds;
            this.setup();
            // Notify the bounds update on all objects that implement the subscriber
            // interface
            for (var _i = 0, _a = this._graphics; _i < _a.length; _i++) {
                var graphic = _a[_i];
                var updateable = graphic;
                if (updateable !== undefined) {
                    updateable.onBoundsUpdated(this._bounds);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphingCalculator.prototype, "backgroundColor", {
        set: function (color) {
            var _this = this;
            if (this._backgroundColorVariable !== undefined &&
                this._backgroundColorVariableChangedCallback !== undefined) {
                this._backgroundColorVariable.unregister(this._backgroundColorVariableChangedCallback);
                this._backgroundColorVariable = undefined;
                this._backgroundColorVariableChangedCallback = undefined;
            }
            if (color instanceof variable_1.Variable) {
                this._backgroundPath.fillColor = color.value;
                this._backgroundColorVariable = color;
                this._backgroundColorVariableChangedCallback =
                    function (variable) {
                        _this._backgroundPath.fillColor = variable.value;
                    };
                this._backgroundColorVariable.register(this._backgroundColorVariableChangedCallback);
            }
            else {
                this._backgroundPath.fillColor = color;
            }
        },
        enumerable: true,
        configurable: true
    });
    GraphingCalculator.prototype.add = function (graphic) {
        var graphicAny = graphic;
        if ('onBoundsUpdated' in graphicAny) {
            var updateable = graphicAny;
            updateable.onBoundsUpdated(this._bounds);
        }
        if ('onScreenTransformUpdated' in graphicAny) {
            var updateable = graphicAny;
            updateable.onScreenTransformUpdated(paper.view.matrix);
        }
        this._graphics.push(graphic);
        graphic.addTo(paper.project);
    };
    GraphingCalculator.prototype.remove = function (graphic) {
        var index = this._graphics.indexOf(graphic);
        if (index > -1) {
            this._graphics[index].remove();
            this._graphics.splice(index, 1);
        }
    };
    GraphingCalculator.prototype.setup = function () {
        // Revert the previous transform
        paper.view.transform(paper.view.matrix.inverted());
        // Apply the new transform
        paper.view.transform(new paper.Matrix(paper.view.viewSize.width / this._bounds.width, 0, 0, -paper.view.viewSize.height / this._bounds.height, paper.view.viewSize.width / 2, paper.view.viewSize.height / 2));
        paper.view.transform(new paper.Matrix(1, 0, 0, 1, -this._bounds.center.x, -this._bounds.center.y));
        // Notify all screen transform subscribers of the change
        for (var _i = 0, _a = this._graphics; _i < _a.length; _i++) {
            var graphic = _a[_i];
            var graphicAny = graphic;
            if ('onScreenTransformUpdated' in graphicAny) {
                var updateable = graphicAny;
                updateable.onScreenTransformUpdated(paper.view.matrix);
            }
        }
    };
    // TODO (Owlree) Paper events are exposed, create intermediary event class
    GraphingCalculator.prototype.on = function (event, callback) {
        paper.view.on(event, callback);
    };
    return GraphingCalculator;
}());
exports.GraphingCalculator = GraphingCalculator;
//# sourceMappingURL=graphingcalculator.js.map