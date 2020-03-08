import { IVariableListener } from './ivariablelistener';
import { Variable } from './variable';
export declare class MixinVariableListener implements IVariableListener {
    private _variableCallbacks;
    saveVariableCallbackRef(key: string, callback: (self: Variable<any>) => void, variable: Variable<any>): void;
    removeVariableCallbackRef(key: string): void;
    unregisterAllVariableCallbacks(): void;
    getVariableCallbackRef(key: string): {
        variable?: Variable<any>;
        callback?: (self: Variable<any>) => void;
    };
}
//# sourceMappingURL=mixinvariablelistener.d.ts.map