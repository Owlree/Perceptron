import { IBoundsSubscriber } from './iboundssubscriber';
import { IFunctionGraphicOptions } from './ifunctiongraphicoptions';
import { ParametricCurveGraphic } from './parametriccurvegraphic';
import { Rectangle } from './rectangle';
import { Vector2 } from './vector2';


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

  public onBoundsUpdated(bounds: Rectangle): void {
    this._from = bounds.left!;
    this._to = bounds.right!;
    this.build();
  }

  /**
   * Returns the y-coordinate given the x-coordinate.
   * @param x The x coordinate
   */
  public yAtX(x: number): number {
    return this.getY(x);
  }

  /**
   * Returns a {@link Vector2} point at coordinates given by the x-coordinate.
   * @param x The x-coordinate
   */
  public pointAtX(x: number): Vector2 {
    return new Vector2(x, this.getY(x));
  }
}
