import Variable from './variable';


/**
 * Interface that describes the options that the constructor of a
 * {@link PointGraphic} accepts as input.
 */
export default interface IPointGraphicOptions {
  color?: paper.Color | Variable<paper.Color>,
  radius?: number
}
