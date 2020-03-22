import { CanvasObject } from './canvasobject';
import { Rectangle } from './rectangle';
export declare class Canvas {
    private _bounds;
    private _canvasBounds;
    private _canvasElement;
    private _context;
    private _objects;
    private _paused;
    private _scale;
    constructor(canvasId: string);
    private resetBounds;
    set scale(scale: number);
    private clear;
    private beginLoop;
    addObject(object: CanvasObject): void;
    removeOBject(object: CanvasObject): void;
    get canvasElement(): HTMLCanvasElement;
    get bounds(): Rectangle;
    get canvasBounds(): Rectangle;
    play(): void;
    pause(): void;
    get paused(): boolean;
}
//# sourceMappingURL=canvas.d.ts.map