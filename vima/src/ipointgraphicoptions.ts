import { Variable } from './variable';
import { PointGraphicType } from './pointgraphictype';


/**
 * Interface that describes the options that the constructor of a
 * {@link PointGraphic} accepts as input.
 */
export interface IPointGraphicOptions {
  color?: paper.Color | Variable<paper.Color>;
  radius?: number;
  type?: PointGraphicType;
  interactive?: boolean;
}
