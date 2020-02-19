import * as paper from 'paper';

import Variable from './variable';


/**
 * Interface that describes the options that the constructor of a
 * {@link CurveGraphic} accepts as input.
 */
export default interface CurveGraphicOptions {
  strokeColor?: paper.Color | Variable<paper.Color>,
  strokeWidth?: number
}
