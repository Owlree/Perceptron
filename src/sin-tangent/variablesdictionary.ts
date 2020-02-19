import Variable from './variable';


/**
 * Interface that describes a dictionary of variables that can be found in the
 * formula for a {@link ParametricCurve}.
 */
export default interface VariablesDictionary {
  [key: string]: number | Variable<number>
}
