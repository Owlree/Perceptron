import IPointGraphicOptions from './ipointgraphicoptions';


/**
 * Interface that describes the options that the constructor of a
 * {@link FreePointGraphic} accepts as input.
 */
export default interface IFreePointGraphicOptions extends IPointGraphicOptions {
  x?: number;
  y?: number;
}
