import ICurveGraphicOptions from './icurvegraphicoptions';
import VariablesDictionary from './ivariablesdictionary';
/**
 * Interface that describes the options that the constructor of a
 * {@link ParametricCurveGraphic} accepts as input.
 */
export default interface IParametricCurveGraphicOptions extends ICurveGraphicOptions {
    from?: number;
    to?: number;
    variables?: VariablesDictionary;
    varStr?: string;
}
//# sourceMappingURL=iparametriccurvegraphicoptions.d.ts.map