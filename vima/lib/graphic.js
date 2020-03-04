"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var paper = require("paper");
/**
 * Base abstract class that represents a drawable mathematical object.
 */
var Graphic = /** @class */ (function () {
    function Graphic() {
        this._path = new paper.Path({ insert: false });
        this._group = new paper.Group({ insert: false });
        this._text = new paper.PointText([0, 0]);
    }
    /**
     * Removes the underlying graphic from its parent.
     */
    Graphic.prototype.remove = function () {
        this._path.remove();
        this._group.remove();
        this._text.remove();
    };
    /**
     * Adds the underlying paper.js path to a paper.js project or item.
     * @param owner The paper.js project or item to add the underlying path to
     */
    Graphic.prototype.addTo = function (owner) {
        this._path.addTo(owner);
        this._group.addTo(owner);
        this._text.addTo(owner);
    };
    // TODO (Owlree) Paper events are exposed, create intermediary event class
    Graphic.prototype.on = function (event, callback) {
        this._group.on(event, callback);
        this._path.on(event, callback);
    };
    return Graphic;
}());
exports.Graphic = Graphic;
//# sourceMappingURL=graphic.js.map