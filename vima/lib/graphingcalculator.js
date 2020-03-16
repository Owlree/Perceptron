"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var paper = require("paper");
var Colors = require("./colors");
var applymixins_1 = require("./applymixins");
var decoratorwatchvariable_1 = require("./decoratorwatchvariable");
var mixinvariablelistener_1 = require("./mixinvariablelistener");
var rectangle_1 = require("./rectangle");
var vector2_1 = require("./vector2");
/**
 * A graphic calculator handles the presentation and interaction with various
 * graphics such as {@link CurveGraphic}, {@link FunctionGraphic},
 * {@link FreePointGraphic}, or others.
 */
var GraphingCalculator = /** @class */ (function () {
    function GraphingCalculator(canvasId, bounds) {
        var _this = this;
        this._bounds = new rectangle_1.Rectangle(new vector2_1.Vector2(0, 0), new vector2_1.Vector2(0, 0));
        this._mousePosition = new vector2_1.Vector2(0, 0);
        this._screenMatrix = new paper.Matrix(1, 0, 0, 1, 0, 0);
        this._graphics = [];
        paper.setup(canvasId);
        this._backgroundPath = new paper.Path.Rectangle(new paper.Point(0, 0), new paper.Point(1, 1));
        this.bounds = bounds;
        this.backgroundColor = Colors.backgroundColor;
        paper.view.on('resize', function () {
            _this.setup();
        });
    }
    Object.defineProperty(GraphingCalculator.prototype, "bounds", {
        set: function (bounds) {
            this._bounds = bounds;
            this._backgroundPath.bounds = new paper.Rectangle(bounds.left, bounds.bottom, bounds.width, bounds.height);
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
        /**
         * @param color The color or variable color to set as background
         */
        set: function (color) {
            this._backgroundPath.fillColor = color;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds a graphic to the graphing calculator
     * @param graphic The graphic to add
     */
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
    /**
     * Removes a graphic from the graphing calculator
     * @param graphic The graphic to remove
     */
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
        paper.view.element.addEventListener('touchstart', function (event) {
            var point = new paper.Point(event.touches[0].pageX, event.touches[0].pageY);
            var localPoint = point.transform(_this._screenMatrix.inverted());
            _this._mousePosition = new vector2_1.Vector2(localPoint.x, localPoint.y);
        });
        paper.view.element.addEventListener('touchmove', function (event) {
            var point = new paper.Point(event.touches[0].pageX, event.touches[0].pageY);
            var localPoint = point.transform(_this._screenMatrix.inverted());
            _this._mousePosition = new vector2_1.Vector2(localPoint.x, localPoint.y);
        });
    };
    // TODO (Owlree) Paper events are exposed, create intermediary event class
    GraphingCalculator.prototype.on = function (event, callback) {
        if (event === 'frame') {
            paper.view.on(event, function (event) {
                callback({ time: event.time, delta: event.delta });
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
    Object.defineProperty(GraphingCalculator.prototype, "canvas", {
        get: function () {
            return paper.view.element;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        decoratorwatchvariable_1.DecoratorWatchVariable
    ], GraphingCalculator.prototype, "backgroundColor", null);
    return GraphingCalculator;
}());
exports.GraphingCalculator = GraphingCalculator;
applymixins_1.applyMixins(GraphingCalculator, [mixinvariablelistener_1.MixinVariableListener]);
//# sourceMappingURL=graphingcalculator.js.map