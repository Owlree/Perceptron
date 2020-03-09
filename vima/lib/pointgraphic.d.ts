import { Graphic } from './graphic';
import { IPointGraphicOptions } from './ipointgraphicoptions';
import { IScreenTransformSubscriber } from './iscreentransformsubscriber';
import { Variable } from './variable';
import { WritableVariable } from './writablevariable';
import { Vector2 } from './vector2';
import { Rectangle } from './rectangle';
/**
 * Base abstract class representing a mathematical point. Handles the the
 * visual aspects of the graphic such as color and size. The position of the
 * point is left to deriving classes.
 */
export declare abstract class PointGraphic extends Graphic implements IScreenTransformSubscriber {
    protected _interactive: boolean;
    protected _path: paper.Path;
    protected _positionVariable: WritableVariable<Vector2>;
    protected _radius: number;
    protected _rotation: number;
    protected _screenMatrix?: paper.Matrix;
    constructor({ color, radius, type }?: IPointGraphicOptions);
    /**
     * @param color The new color of the point graphic.
     */
    set color(color: paper.Color | Variable<paper.Color>);
    /**
     * @param radius The new radius of the point graphic
     */
    set radius(radius: number);
    /**
     * @returns The radius of the point graphic
     */
    get radius(): number;
    /**
     * @param rotation The new rotation of the point graphic
     */
    set rotation(rotation: number);
    /**
     * @returns The rotation of the point graphic
     */
    get rotation(): number;
    protected set _position(position: Vector2 | Variable<Vector2>);
    /**
     * @returns The position of the point.
     */
    get position(): Vector2;
    /**
     * @param position The new position of the point.
     */
    set position(position: Vector2);
    /**
     * @returns A variable in sync with the position of the point.
     */
    get positionVariable(): Variable<Vector2>;
    /**
     * @returns The bounds of the point graphic.
     */
    get bounds(): Rectangle;
    onScreenTransformUpdated(matrix: paper.Matrix): void;
}
//# sourceMappingURL=pointgraphic.d.ts.map