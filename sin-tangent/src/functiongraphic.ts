import BoundsSubscriber from './boundssubscriber';
import FunctionGraphicOptions from './functiongraphicoptions';
import ParametrizedCurveGraphic from './parametrizedcurvegraphic';

/**
 * Object that represents the graph of an one variable function.
 */
export default class FunctionGraphic extends ParametrizedCurveGraphic implements BoundsSubscriber {
  constructor(yFuncStr: string, varStr: string,
    options: FunctionGraphicOptions = {}) {

    if (options.from !== undefined) {
      var from = options.from;
    } else {
      var from = 0;
    }

    if (options.to !== undefined) {
      var to = options.to;
    } else {
      var to = 1;
    }

    super('x', yFuncStr, varStr, {
      from: from,
      to: to,
      variables: options.variables
    });
  }

  public onBoundsUpdated(bounds: paper.Rectangle) {
    this._from = bounds.left;
    this._to = bounds.right;
    this.build()
  }
}
