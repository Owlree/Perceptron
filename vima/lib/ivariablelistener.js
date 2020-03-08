"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function implementsVariableListener(object) {
    // TODO (Owlree) There should be a nicer way of checking interface compliance
    return object['saveVariableCallbackRef'] !== undefined &&
        object['removeVariableCallbackRef'] !== undefined &&
        object['getVariableCallbackRef'] !== undefined &&
        object['unregisterAllVariableCallbacks'] !== undefined;
}
exports.implementsVariableListener = implementsVariableListener;
//# sourceMappingURL=ivariablelistener.js.map