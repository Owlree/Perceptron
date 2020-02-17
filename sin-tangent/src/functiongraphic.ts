import BoundsSubscriber from './boundssubscriber';
import FunctionGraphicOptions from './functiongraphicoptions';
import ParametrizedCurveGraphic from './parametrizedcurvegraphic';

/**
 * Object that represents the graph of an one variable function.
 */
export default class FunctionGraphic extends ParametrizedCurveGraphic implements BoundsSubscriber {
  constructor(yFuncStr: string, options: FunctionGraphicOptions = {}) {

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

    if (options.varStr !== undefined) {
      var varStr = options.varStr;
    } else {
      var varStr = 'x';
    }

    super(varStr, yFuncStr, {
      from: from,
      to: to,
      variables: options.variables,
      varStr: varStr
    });
  }

  public onBoundsUpdated(bounds: paper.Rectangle) {
    this._from = bounds.left;
    this._to = bounds.right;
    this.build()
  }
}
