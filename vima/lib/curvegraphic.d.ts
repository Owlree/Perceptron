import CurveGraphicOptions from './icurvegraphicoptions';
import Graphic from './graphic';
import Variable from './variable';
/**
 * Abstract class for a curve graphic. Deals with all visual options. It can't
 * contain information about the actual object represented.
 */
export default abstract class CurveGraphic extends Graphic {
    vars: Array<Variable<number>>;
    protected _width: number;
    protected _colorVariable?: Variable<paper.Color>;
    protected _colorVariableChangedCallback?: ((variable: Variable<paper.Color>) => void);
    constructor({ strokeColor, strokeWidth }?: CurveGraphicOptions);
    set color(color: paper.Color | Variable<paper.Color>);
    set width(width: number);
}
//# sourceMappingURL=curvegraphic.d.ts.map