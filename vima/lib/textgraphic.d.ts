import { Graphic } from './graphic';
import { IScreenTransformSubscriber } from './iscreentransformsubscriber';
import { ITextGraphicOptions } from './itextgraphicoptions';
import { Variable } from './variable';
import { Vector2 } from './vector2';
/**
 * Represents a text that can be added to {@link GraphingCalculator}, most
 * often as label.
 */
export declare class TextGraphic extends Graphic implements IScreenTransformSubscriber {
    private _offset;
    private _text;
    protected _rotation: number;
    protected _screenMatrix: paper.Matrix | undefined;
    constructor({ color, content, fontFamily, fontSize, fontWeight, offset, position }?: ITextGraphicOptions);
    /**
     * @param rotation The new rotation of the text
     */
    set rotation(rotation: number);
    /**
     * @returns The rotation of the text
     */
    get rotation(): number;
    /**
     * @param position The new position of the text
     */
    set position(position: Variable<Vector2> | Vector2);
    /**
     * Sets the offset of the text. The final position on the canvas is calculed
     * by add the offset to the position.
     * @param offset The new offset of the text
     */
    set offset(offset: Variable<Vector2> | Vector2);
    /**
     * @param color The new color of the text
     */
    set color(color: Variable<paper.Color> | paper.Color);
    onScreenTransformUpdated(matrix: paper.Matrix): void;
}
//# sourceMappingURL=textgraphic.d.ts.map