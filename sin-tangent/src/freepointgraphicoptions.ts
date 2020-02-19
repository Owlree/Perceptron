import PointGraphicOptions from './pointgraphicoptions';


/**
 * Interface that describes the options that the constructor of a
 * {@link FreePointGraphic} accepts as input.
 */
export default interface FreePointGraphicOptions extends PointGraphicOptions {
  x?: number,
  y?: number
}
