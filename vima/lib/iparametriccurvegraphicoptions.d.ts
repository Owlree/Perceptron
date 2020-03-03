import { ICurveGraphicOptions } from './icurvegraphicoptions';
import { IVariablesDictionary } from './ivariablesdictionary';
/**
 * Interface that describes the options that the constructor of a
 * {@link ParametricCurveGraphic} accepts as input.
 */
export interface IParametricCurveGraphicOptions extends ICurveGraphicOptions {
    from?: number;
    to?: number;
    variables?: IVariablesDictionary;
    varStr?: string;
}
//# sourceMappingURL=iparametriccurvegraphicoptions.d.ts.map