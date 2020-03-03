import { IBoundsSubscriber } from './iboundssubscriber';
import { IFunctionGraphicOptions } from './ifunctiongraphicoptions';
import { ParametricCurveGraphic } from './parametriccurvegraphic';


/**
 * Class that represents the graph of an one variable function.
 */
export class FunctionGraphic
  extends ParametricCurveGraphic
  implements IBoundsSubscriber {

  public constructor(yFuncStr: string, {
    from = 0, to = 1, varStr = 'x', variables = {}, ...others
  }: IFunctionGraphicOptions = {}) {
    super(varStr, yFuncStr, {
      from: from,
      to: to,
      variables: variables,
      varStr: varStr,
      ...others
    });
  }

  public onBoundsUpdated(bounds: paper.Rectangle): void {
    this._from = bounds.left!;
    this._to = bounds.right!;
    this.build();
  }

  public yAtX(x: number): number {
    return this.getY(x);
  }
}
