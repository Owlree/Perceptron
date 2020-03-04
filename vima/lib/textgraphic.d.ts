import { Graphic } from './graphic';
import { IScreenTransformSubscriber } from './iscreentransformsubscriber';
import { ITextGraphicOptions } from './itextgraphicoptions';
import { Variable } from './variable';
import { Vector2 } from './vector2';
export declare class TextGraphic extends Graphic implements IScreenTransformSubscriber {
    private _offset;
    protected _rotation: number;
    protected _screenMatrix: paper.Matrix | undefined;
    constructor({ color, content, fontFamily, fontSize, fontWeight, offset, position }?: ITextGraphicOptions);
    set rotation(rotation: number);
    get rotation(): number;
    set position(position: Variable<Vector2> | Vector2);
    set offset(offset: Variable<Vector2> | Vector2);
    set color(color: Variable<paper.Color> | paper.Color);
    onScreenTransformUpdated(matrix: paper.Matrix): void;
}
//# sourceMappingURL=textgraphic.d.ts.map