import { Variable } from './variable';
export interface IVariableListener {
    saveVariableCallbackRef(key: string, callback: (self: Variable<any>) => void, variable: Variable<any>): void;
    removeVariableCallbackRef(key: string): void;
    getVariableCallbackRef(key: string): {
        variable?: Variable<any>;
        callback?: (self: Variable<any>) => void;
    };
    unregisterAllVariableCallbacks(): void;
}
export declare function implementsVariableListener(object: any): boolean;
//# sourceMappingURL=ivariablelistener.d.ts.map