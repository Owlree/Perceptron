import { Variable } from './variable';

export interface IVariableListener {
  saveVariableCallbackRef(key: string, callback: (self: Variable<any>) => void, variable: Variable<any>): void;
  removeVariableCallbackRef(key: string): void;
  getVariableCallbackRef(key: string): {variable?: Variable<any>; callback?: (self: Variable<any>) => void};
  unregisterAllVariableCallbacks(): void;
}

export function implementsVariableListener(object: any): boolean {
  // TODO (Owlree) There should be a nicer way of checking interface compliance
  return object['saveVariableCallbackRef'] !== undefined &&
    object['removeVariableCallbackRef'] !== undefined &&
    object['getVariableCallbackRef'] !== undefined &&
    object['unregisterAllVariableCallbacks'] !== undefined;
}
