"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Colors = require("./colors");
var rectangle_1 = require("./rectangle");
var vector2_1 = require("./vector2");
var Canvas = /** @class */ (function () {
    function Canvas(canvasId) {
        var _this = this;
        this._bounds = new rectangle_1.Rectangle(new vector2_1.Vector2(0, 0), new vector2_1.Vector2(1, 1));
        this._canvasBounds = new rectangle_1.Rectangle(new vector2_1.Vector2(0, 0), new vector2_1.Vector2(1, 1));
        this._paused = false;
        this._scale = 20;
        this._canvasElement = document.getElementById(canvasId);
        this._context = this._canvasElement.getContext('2d');
        this._canvasElement.width = this._canvasElement.clientWidth;
        this._canvasElement.height = this._canvasElement.clientHeight;
        this._objects = [];
        window.addEventListener('resize', function () {
            _this.resetBounds();
        });
        this.resetBounds();
        this.beginLoop();
        window.addEventListener('message', function (event) {
            switch (event.data) {
                case 'start':
                    _this.play();
                    break;
                case 'pause':
                    _this.pause();
                    document.body.style.cursor = '';
                    break;
            }
        });
    }
    Canvas.prototype.resetBounds = function () {
        this._canvasElement.width = this._canvasElement.clientWidth;
        this._canvasElement.height = this._canvasElement.clientHeight;
        this._bounds = new rectangle_1.Rectangle(new vector2_1.Vector2(-this._canvasElement.width / this._canvasElement.height * this._scale / 2, this._canvasElement.height / this._canvasElement.height * this._scale / 2), new vector2_1.Vector2(this._canvasElement.width / this._canvasElement.height * this._scale / 2, -this._canvasElement.height / this._canvasElement.height * this._scale / 2));
        this._canvasBounds = new rectangle_1.Rectangle(new vector2_1.Vector2(0, 0), new vector2_1.Vector2(this._canvasElement.width, this._canvasElement.height));
    };
    Object.defineProperty(Canvas.prototype, "scale", {
        set: function (scale) {
            this._scale = scale;
            this.resetBounds();
        },
        enumerable: true,
        configurable: true
    });
    Canvas.prototype.clear = function () {
        this._context.fillStyle = Colors.backgroundColor.value.toCSS(false);
        this._context.fillRect(0, 0, this._canvasElement.width, this._canvasElement.height);
    };
    Canvas.prototype.beginLoop = function () {
        var _this = this;
        var sentTime = new Date().getTime() / 1000.0;
        var DT = 1 / 60;
        var loop = function () {
            _this.clear();
            if (!_this._paused) {
                var t = new Date().getTime() / 1000.0;
                if (t - sentTime > 1) {
                    sentTime = t;
                }
                var done = 0;
                while (sentTime < t && done < 3) {
                    sentTime += DT;
                    for (var _i = 0, _a = _this._objects; _i < _a.length; _i++) {
                        var object = _a[_i];
                        object.update(DT, t);
                    }
                    done += 1;
                }
                _this._objects.sort(function (a, b) { return (a.zIndex > b.zIndex) ? 1 : -1; });
                for (var _b = 0, _c = _this._objects; _b < _c.length; _b++) {
                    var object = _c[_b];
                    object.draw(_this._context, _this._bounds, _this._canvasBounds);
                }
            }
            else {
                sentTime = new Date().getTime() / 1000.0;
            }
            for (var _d = 0, _e = _this._objects; _d < _e.length; _d++) {
                var object = _e[_d];
                object.draw(_this._context, _this._bounds, _this._canvasBounds);
            }
            window.requestAnimationFrame(loop);
        };
        loop();
    };
    Canvas.prototype.addObject = function (object) {
        this._objects.push(object);
    };
    Canvas.prototype.removeOBject = function (object) {
        var index = this._objects.indexOf(object);
        if (index > -1) {
            this._objects.splice(index, 1);
        }
    };
    Object.defineProperty(Canvas.prototype, "canvasElement", {
        get: function () {
            return this._canvasElement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "bounds", {
        get: function () {
            return this._bounds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "canvasBounds", {
        get: function () {
            return this._canvasBounds;
        },
        enumerable: true,
        configurable: true
    });
    Canvas.prototype.play = function () {
        this._paused = false;
    };
    Canvas.prototype.pause = function () {
        this._paused = true;
    };
    Object.defineProperty(Canvas.prototype, "paused", {
        get: function () {
            return this._paused;
        },
        enumerable: true,
        configurable: true
    });
    return Canvas;
}());
exports.Canvas = Canvas;
//# sourceMappingURL=canvas.js.map