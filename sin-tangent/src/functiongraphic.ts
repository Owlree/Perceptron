import BoundsSubscriber from './boundssubscriber';
import FunctionGraphicOptions from './functiongraphicoptions';
import ParametricCurveGraphic from './parametriccurvegraphic';


/**
 * Object that represents the graph of an one variable function.
 */
export default class FunctionGraphic
  extends ParametricCurveGraphic
  implements BoundsSubscriber {

  constructor(yFuncStr: string, {
    from = 0, to = 1, varStr = 'x', variables = {}, ...others
  }: FunctionGraphicOptions = {}) {
    super(varStr, yFuncStr, {
      from: from,
      to: to,
      variables: variables,
      varStr: varStr,
      ...others
    });
  }

  public onBoundsUpdated(bounds: paper.Rectangle) {
    this._from = bounds.left!;
    this._to = bounds.right!;
    this.build()
  }

  public yAtX(x: number): number {
    return this.getY(x);
  }
}
