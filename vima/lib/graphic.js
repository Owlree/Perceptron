"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paper = require("paper");
/**
 * Base abstract class that represents a drawable mathematical object.
 */
class Graphic {
    constructor() {
        this._path = new paper.Path({ insert: false });
        this._group = new paper.Group({ insert: false });
    }
    /**
     * Removes the underlying graphic from its parent.
     */
    remove() {
        this._path.remove();
        this._group.remove();
    }
    /**
     * Adds the underlying paper.js path to a paper.js project or item.
     * @param owner The paper.js project or item to add the underlying path to
     */
    addTo(owner) {
        this._path.addTo(owner);
        this._group.addTo(owner);
    }
}
exports.default = Graphic;
//# sourceMappingURL=graphic.js.map