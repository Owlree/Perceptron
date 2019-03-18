import { View } from './view';
import { Square } from './square';

let canvas: HTMLCanvasElement = document.createElement('canvas');
canvas.width  = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.9;
canvas.style.backgroundColor = 'white';
canvas.style.margin = 'auto';

document.body.appendChild(canvas);

let view: View = new View(canvas);
let square = new Square();

view.AddDrawable(square);

square.mX = 0;
square.mY = 0;
square.mHeight = 200;
square.mWidth = 200;

function Loop(timestamp: number): void {
    view.Clear();
    square.mRotation = (timestamp % 10000) / 9999 * Math.PI;
    view.Draw();
    window.requestAnimationFrame(Loop);
}

Loop(0);
