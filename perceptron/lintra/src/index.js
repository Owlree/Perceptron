"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var vima_1 = require("vima");
// Script scope
(function () {
    var Lintra = /** @class */ (function (_super) {
        __extends(Lintra, _super);
        function Lintra() {
            var _this = _super.call(this) || this;
            _this._c = 1;
            _this._t = 0;
            return _this;
        }
        Lintra.prototype.update = function (dt, _) {
            this._t += dt;
            if (this._t >= 3) {
                this._t -= 3;
            }
            if (this._t < 0.5) {
                this._c = (-Math.cos(2 * Math.PI * this._t) + 1) / 2;
            }
            else if (this._t < 1.5) {
                this._c = 1;
            }
            else if (this._t < 2) {
                this._c = (-Math.cos(2 * Math.PI * this._t) + 1) / 2;
            }
            else if (this._t < 3) {
                this._c = 0;
            }
        };
        Lintra.prototype.draw = function (context) {
            var top = new vima_1.Vector2(0, canvas.bounds.top);
            var bottom = new vima_1.Vector2(0, canvas.bounds.bottom);
            var topC = top.coordinatesTransform(canvas.bounds, canvas.canvasBounds);
            var bottomC = bottom.coordinatesTransform(canvas.bounds, canvas.canvasBounds);
            context.lineWidth = 2;
            context.strokeStyle = vima_1.Colors.mainColor.toCSS();
            context.beginPath();
            context.moveTo(topC.x, topC.y);
            context.lineTo(bottomC.x, bottomC.y);
            context.stroke();
            var left = new vima_1.Vector2(canvas.bounds.left, 0);
            var right = new vima_1.Vector2(canvas.bounds.right, 0);
            var leftC = left.coordinatesTransform(canvas.bounds, canvas.canvasBounds);
            var rightC = right.coordinatesTransform(canvas.bounds, canvas.canvasBounds);
            context.lineWidth = 2;
            context.strokeStyle = vima_1.Colors.mainColor.toCSS();
            context.beginPath();
            context.moveTo(leftC.x, leftC.y);
            context.lineTo(rightC.x, rightC.y);
            context.stroke();
            for (var x = Math.floor(canvas.bounds.left / 2) * 2; x <= canvas.bounds.right; x += 0.25) {
                for (var y = Math.floor(canvas.bounds.bottom / 2) * 2; y <= canvas.bounds.top; y += 0.25) {
                    var point0 = new vima_1.Vector2(x, y);
                    var point1 = new vima_1.Vector2(2 * x - y, 2 * x + 3 * y);
                    var direction = point1.subtract(point0);
                    var point = point0.add(direction.multiply(this._c));
                    var pointC = point.coordinatesTransform(canvas.bounds, canvas.canvasBounds);
                    context.fillStyle = vima_1.Colors.blueColor.toCSS();
                    context.beginPath();
                    context.moveTo(pointC.x, pointC.y);
                    context.arc(pointC.x, pointC.y, 3, 0, 2 * Math.PI);
                    context.fill();
                }
            }
        };
        return Lintra;
    }(vima_1.CanvasObject));
    var canvas = new vima_1.Canvas('canvas');
    canvas.scale = 5;
    var lintra = new Lintra();
    canvas.addObject(lintra);
    // End script scope
})();
//# sourceMappingURL=index.js.map