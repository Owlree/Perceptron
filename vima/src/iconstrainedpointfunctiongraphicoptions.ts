import { IPointGraphicOptions } from './ipointgraphicoptions';
import { Variable } from './variable';


/**
 * Interface that describes the options that the constructor of a
 * {@link ConstrainedPointFunctionGraphic} accepts as input.
 */
export interface IConstrainedPointFunctionGraphicOptions
  extends IPointGraphicOptions {
  x?: number | Variable<number>;
}
