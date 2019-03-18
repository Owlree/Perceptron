import { Drawable } from './drawable'

export class View {
    private mDrawables: Drawable[] = []
    private mCanvasContext: CanvasRenderingContext2D;
    private mCanvasElement: HTMLCanvasElement;
    
     constructor(canvasElement: HTMLCanvasElement) {
         this.mCanvasElement = canvasElement;
         this.mCanvasContext = canvasElement.getContext('2d');
         this.mCanvasContext.translate(
             canvasElement.width / 2, canvasElement.height / 2);
     }
    
    public Draw() {
        for (let drawable of this.mDrawables) {
            drawable.Draw(this.mCanvasContext);
        }
    }
    
    public AddDrawable(drawable: Drawable) {
        this.mDrawables.push(drawable);
    }
    
    public Clear() {
        this.mCanvasContext.clearRect(
            -this.mCanvasElement.width / 2, -this.mCanvasElement.height / 2, 
            this.mCanvasElement.width, this.mCanvasElement.height);
    }
}