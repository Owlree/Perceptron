import * as paper from 'paper';

import Variable from "./variable";


export default interface CurveGraphicOptions {
  strokeColor?: paper.Color | Variable<paper.Color>,
  strokeWidth?: number
}
