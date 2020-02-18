import CurveGraphicOptions from './curvegraphicoptions';
import VariablesDictionary from './variablesdictionary';


/**
 * Interface describing the mathematical information needed to plot a
 * parametric curve.
 */
export default interface ParametricCurveGraphicOptions
  extends CurveGraphicOptions {

  from?: number,
  to?: number,
  variables?: VariablesDictionary,
  varStr?: string
}
