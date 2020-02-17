import VariablesDictionary from './variablesdictionary';

export default interface ParametrizedCurveGraphicOptions {
  from: number,
  to: number,
  variables?: VariablesDictionary,
  varStr?: string
}
