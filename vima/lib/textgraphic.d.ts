import { Graphic } from './graphic';
import { IScreenTransformSubscriber } from './iscreentransformsubscriber';
import { Variable } from './variable';
import { Vector2 } from './vector2';
export declare class TextGraphic extends Graphic implements IScreenTransformSubscriber {
    private _offset;
    protected _rotation: number;
    protected _screenMatrix: paper.Matrix | undefined;
    constructor(text: string, position: Variable<Vector2> | Vector2, offset: Vector2);
    set rotation(rotation: number);
    get rotation(): number;
    set position(position: Variable<Vector2> | Vector2);
    set offset(offset: Vector2);
    onScreenTransformUpdated(matrix: paper.Matrix): void;
}
//# sourceMappingURL=textgraphic.d.ts.map