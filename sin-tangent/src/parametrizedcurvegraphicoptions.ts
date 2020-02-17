import CurveGraphicOptions from './curvegraphicoptions';
import VariablesDictionary from './variablesdictionary';

export default interface ParametrizedCurveGraphicOptions
  extends CurveGraphicOptions {

  from?: number,
  to?: number,
  variables?: VariablesDictionary,
  varStr?: string
}
