import { Drawable } from './drawable';

export class Square implements Drawable {
    public mRotation: number = 0;
    public mX: number = 0;
    public mY: number = 0;
    public mHeight: number = 0;
    public mWidth: number = 0;
    public mStyle: string = '#3fe3ef';
    
    public Draw(canvasContext: CanvasRenderingContext2D): void {
        canvasContext.beginPath();
        canvasContext.translate(
            this.mX, 
            this.mY);
        canvasContext.rotate(this.mRotation);
        canvasContext.strokeStyle = this.mStyle;
        canvasContext.rect(
            -this.mWidth / 2, -this.mHeight / 2, 
            this.mWidth, this.mHeight);
        canvasContext.stroke();
        canvasContext.rotate(-this.mRotation);
        canvasContext.translate(-this.mX, -this.mY);
    }
}
