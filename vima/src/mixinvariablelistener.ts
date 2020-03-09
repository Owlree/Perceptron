import { IVariableListener } from './ivariablelistener';
import { Variable } from './variable';


/**
 * A mixin that allows a class to watch {@link Variable} objects by using
 * {@link DecoratorWatchvAriable}.
 */
export class MixinVariableListener implements IVariableListener {
  private _variableCallbacks: {
    [key: string]: {
      variable: Variable<any>,
      callback: (self: Variable<any>) => void
    }
  } = {};

  public saveVariableCallbackRef(
    key: string, callback: (self: Variable<any>) => void,
    variable: Variable<any>): void {
    // Lazy create the property. Mixins don't initialize properties in the host
    // class, so we have to do it here.
    if (this._variableCallbacks === undefined) {
      this._variableCallbacks = {};
    }
    this._variableCallbacks[key] = {callback: callback, variable: variable};
  }

  public removeVariableCallbackRef(key: string): void {
    if (this._variableCallbacks === undefined) return;
    delete this._variableCallbacks[key];
  }

  public unregisterAllVariableCallbacks(): void {
    if (this._variableCallbacks === undefined) return;
    for (let key in this._variableCallbacks) {
      this._variableCallbacks[key].variable.unregister(
        this._variableCallbacks[key].callback);
    }
  }

  public getVariableCallbackRef(key: string): {
    variable?: Variable<any>;
    callback?: (self: Variable<any>) => void
  } {
    if (this._variableCallbacks === undefined) return {};
    if (key in this._variableCallbacks) {
      return this._variableCallbacks[key];
    } else {
      return {};
    }
  }
}