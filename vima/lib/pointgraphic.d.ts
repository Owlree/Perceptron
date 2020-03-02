import Graphic from './graphic';
import PointGraphicOptions from './ipointgraphicoptions';
import ScreenTransformSubscriber from './iscreentransformsubscriber';
import Variable from './variable';
import WritableVariable from './writeablevariable';
import Vector2 from './vector2';
/**
 * Base abstract class representing a mathematical point. Handles the the
 * visual aspects of the graphic such as color and size. The position of the
 * point is left to deriving classes.
 */
export default abstract class PointGraphic extends Graphic implements ScreenTransformSubscriber {
    protected _colorVariable?: Variable<paper.Color>;
    protected _radius: number;
    protected _rotation: number;
    protected _screenMatrix: paper.Matrix | undefined;
    protected _positionVariable: WritableVariable<Vector2>;
    protected _interactive: boolean;
    constructor({ color, radius, type, interactive }?: PointGraphicOptions);
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
}
//# sourceMappingURL=pointgraphic.d.ts.map