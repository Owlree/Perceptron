import * as _ from 'lodash';

interface Drawable {
    Draw(canvasContext: CanvasRenderingContext2D): void
}

class View {
    private mDrawables: Drawable[] = []
    private mCanvasContext: CanvasRenderingContext2D;
    
     constructor(canvasContext: CanvasRenderingContext2D) {
         this.mCanvasContext = canvasContext;
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
        this.mCanvasContext.fillStyle = 'white';
        this.mCanvasContext.fillRect(0, 0, 5000, 5000);
    }
}

class Square implements Drawable {
    
    public mRotation: number = 0;
    public mX: number = 0;
    public mY: number = 0;
    public mHeight: number = 0;
    public mWidth: number = 0;
    
    public Draw(canvasContext: CanvasRenderingContext2D): void {
        context.beginPath();
        canvasContext.translate(
            this.mX, 
            this.mY);
        canvasContext.rotate(this.mRotation);
        canvasContext.strokeStyle = 'red';
        canvasContext.rect(
            -this.mWidth / 2, -this.mHeight / 2, 
            this.mWidth, this.mHeight);
        canvasContext.stroke();
        canvasContext.rotate(-this.mRotation);
        canvasContext.translate(
            -(this.mX), 
            -(this.mY));
    }
}

let canvas: HTMLCanvasElement = document.createElement('canvas');
canvas.width  = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.9;
canvas.style.backgroundColor = 'white';
canvas.style.margin = 'auto';

let context: CanvasRenderingContext2D = canvas.getContext('2d');

document.body.appendChild(canvas);
let view: View = new View(context);
let square = new Square();
view.AddDrawable(square);

square.mX = canvas.width / 2;
square.mY = canvas.height / 2;
square.mHeight = canvas.height * 0.9;
square.mWidth = canvas.width * 0.9;

function Loop(timestamp: number): void {
    view.Clear();
    square.mRotation = (timestamp % 10000) / 9999 * Math.PI;
    view.Draw();
    window.requestAnimationFrame(Loop);
}

Loop(0);
