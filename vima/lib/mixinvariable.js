"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MixinVariable {
    constructor() {
        this._subscribers = [];
    }
    // TODO (Owlree) This code is duplicated with the generic variable code
    register(callback) {
        if (this._subscribers === undefined) {
            this._subscribers = [];
        }
        this._subscribers.push(callback);
    }
    unregister(callback) {
        const index = this._subscribers.indexOf(callback);
        if (index > -1) {
            this._subscribers.splice(index, 1);
        }
    }
    notify() {
        if (this._subscribers === undefined)
            return;
        for (let subscriber of this._subscribers) {
            subscriber(this);
        }
    }
}
exports.default = MixinVariable;
//# sourceMappingURL=mixinvariable.js.map