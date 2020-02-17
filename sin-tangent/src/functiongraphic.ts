import BoundsSubscriber from './boundssubscriber';
import FunctionGraphicOptions from './functiongraphicoptions';
import ParametrizedCurveGraphic from './parametrizedcurvegraphic';

/**
 * Object that represents the graph of an one variable function.
 */
export default class FunctionGraphic extends ParametrizedCurveGraphic implements BoundsSubscriber {
  constructor(yFuncStr: string, {
    from = 0, to = 1, varStr = 'x', variables = {}
  }: FunctionGraphicOptions = {}) {

    super(varStr, yFuncStr, {
      from: from,
      to: to,
      variables: variables,
      varStr: varStr
    });
  }

  public onBoundsUpdated(bounds: paper.Rectangle) {
    this._from = bounds.left;
    this._to = bounds.right;
    this.build()
  }
}
