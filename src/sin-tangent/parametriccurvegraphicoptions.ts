import CurveGraphicOptions from './curvegraphicoptions';
import VariablesDictionary from './variablesdictionary';


/**
 * Interface that describes the options that the constructor of a
 * {@link ParametricCurveGraphic} accepts as input.
 */
export default interface ParametricCurveGraphicOptions
  extends CurveGraphicOptions {

  from?: number,
  to?: number,
  variables?: VariablesDictionary,
  varStr?: string
}
