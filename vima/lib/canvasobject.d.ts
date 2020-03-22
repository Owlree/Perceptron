import { Rectangle } from './rectangle';
export declare abstract class CanvasObject {
    visible: boolean;
    abstract draw(context: CanvasRenderingContext2D, bounds: Rectangle, canvasBounds: Rectangle): void;
    update(_: number, __: number): void;
}
//# sourceMappingURL=canvasobject.d.ts.map