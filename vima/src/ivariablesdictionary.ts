import { Variable } from './variable';


/**
 * Interface that describes a dictionary of variables that can be found in the
 * formula for a {@link ParametricCurve}.
 */
export interface IVariablesDictionary {
  [key: string]: number | Variable<number>;
}
