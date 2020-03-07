"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var paper = require("paper");
var Colors = require("./colors");
var variable_1 = require("./variable");
var vector2_1 = require("./vector2");
/**
 * A graphic calculator handles the presentation and interaction with various
 * graphics such as {@link CurveGraphic}, {@link FunctionGraphic},
 * {@link FreePointGraphic}, or others.
 */
var GraphingCalculator = /** @class */ (function () {
    function GraphingCalculator(canvasId, bounds) {
        var _this = this;
        this._backgroundColorVariable = undefined;
        this._graphics = [];
        this._mousePosition = new vector2_1.Vector2(0, 0);
        this._screenMatrix = new paper.Matrix(1, 0, 0, 1, 0, 0);
        paper.setup(canvasId);
        this._bounds = bounds;
        this._backgroundPath = new paper.Path.Rectangle(this._bounds);
        this.backgroundColor = Colors.backgroundColor;
        paper.view.on('resize', function () {
            _this.setup();
        });
        this.setup();
    }
    Object.defineProperty(GraphingCalculator.prototype, "bounds", {
        set: function (bounds) {
            console.log(bounds);
            this._bounds = bounds;
            this._backgroundPath.bounds = new paper.Rectangle(this._bounds.left, this._bounds.top, this.bounds.width, this._bounds.height);
            // Transforms the paper view according to the new bounds
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
        var _this = this;
        // Revert the previous transform
        paper.view.transform(this._screenMatrix.inverted());
        // Apply the new transform
        paper.view.transform(new paper.Matrix(paper.view.viewSize.width / this._bounds.width, 0, 0, -paper.view.viewSize.height / this._bounds.height, paper.view.viewSize.width / 2, paper.view.viewSize.height / 2));
        paper.view.transform(new paper.Matrix(1, 0, 0, 1, -this._bounds.center.x, -this._bounds.center.y));
        this._screenMatrix = paper.view.matrix;
        // Notify all screen transform subscribers of the change
        for (var _i = 0, _a = this._graphics; _i < _a.length; _i++) {
            var graphic = _a[_i];
            var graphicAny = graphic;
            if ('onScreenTransformUpdated' in graphicAny) {
                var updateable = graphicAny;
                updateable.onScreenTransformUpdated(paper.view.matrix);
            }
        }
        // Subscribe to the mouse position
        paper.view.element.addEventListener('mousemove', function (event) {
            var point = new paper.Point(event.clientX, event.clientY);
            var localPoint = point.transform(_this._screenMatrix.inverted());
            _this._mousePosition = new vector2_1.Vector2(localPoint.x, localPoint.y);
        });
    };
    // TODO (Owlree) Paper events are exposed, create intermediary event class
    GraphingCalculator.prototype.on = function (event, callback) {
        if (event === 'frame') {
            paper.view.on(event, function (event) {
                callback({ time: event.time });
            });
        }
        else {
            paper.view.on(event, callback);
        }
    };
    Object.defineProperty(GraphingCalculator.prototype, "mousePosition", {
        get: function () {
            return this._mousePosition;
        },
        enumerable: true,
        configurable: true
    });
    GraphingCalculator.prototype.contains = function (position) {
        return paper.view.bounds.contains(new paper.Point(position.x, position.y));
    };
    return GraphingCalculator;
}());
exports.GraphingCalculator = GraphingCalculator;
//# sourceMappingURL=graphingcalculator.js.map