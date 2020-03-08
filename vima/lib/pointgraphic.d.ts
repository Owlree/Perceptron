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
    constructor({ color, radius, type, interactive }?: IPointGraphicOptions);
    private set interactive(value);
    set color(color: paper.Color | Variable<paper.Color>);
    set radius(radius: number);
    get radius(): number;
    set rotation(rotation: number);
    get rotation(): number;
    protected set _position(position: Vector2 | Variable<Vector2>);
    get position(): Vector2;
    set position(position: Vector2);
    get positionVariable(): Variable<Vector2>;
    onScreenTransformUpdated(matrix: paper.Matrix): void;
    get bounds(): Rectangle;
}
//# sourceMappingURL=pointgraphic.d.ts.map