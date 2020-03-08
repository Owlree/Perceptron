"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var paper = require("paper");
var applymixins_1 = require("./applymixins");
var mixinvariablelistener_1 = require("./mixinvariablelistener");
/**
 * Base abstract class that represents a drawable mathematical object.
 */
var Graphic = /** @class */ (function () {
    function Graphic() {
        this._item = new paper.Path({ insert: false });
    }
    /**
     * Removes the underlying graphic from its parent.
     */
    Graphic.prototype.remove = function () {
        this._item.remove();
    };
    /**
     * Adds the underlying paper.js path to a paper.js project or item.
     * @param owner The paper.js project or item to add the underlying path to
     */
    Graphic.prototype.addTo = function (owner) {
        this._item.addTo(owner);
    };
    // TODO (Owlree) Paper events are exposed, create intermediary event class
    Graphic.prototype.on = function (event, callback) {
        this._item.on(event, callback);
    };
    return Graphic;
}());
exports.Graphic = Graphic;
applymixins_1.applyMixins(Graphic, [mixinvariablelistener_1.MixinVariableListener]);
//# sourceMappingURL=graphic.js.map