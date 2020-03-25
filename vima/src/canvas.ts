
import * as Colors from './colors';
import { CanvasObject } from './canvasobject';
import { Rectangle } from './rectangle';
import { Vector2 } from './vector2';

export class Canvas {

  private _bounds: Rectangle = new Rectangle(new Vector2(0, 0), new Vector2(1, 1));
  private _canvasBounds: Rectangle = new Rectangle(new Vector2(0, 0), new Vector2(1, 1));
  private _canvasElement: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D;
  private _objects: Array<CanvasObject>;
  private _paused: boolean = false;
  private _scale: number = 20;

  constructor(canvasId: string) {
    this._canvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
    this._context = this._canvasElement.getContext('2d')!;
    this._canvasElement.width = this._canvasElement.clientWidth;
    this._canvasElement.height = this._canvasElement.clientHeight;

    this._objects = [];

    window.addEventListener('resize', () => {
      this.resetBounds();
    });
    this.resetBounds();
    this.beginLoop();

    window.addEventListener('message', (event: MessageEvent) => {
      switch (event.data) {
        case 'start':
          this.play();
          break;
        case 'pause':
          this.pause();
          document.body.style.cursor = '';
          break;
      }
    });
  }

  private resetBounds(): void {
    this._canvasElement.width = this._canvasElement.clientWidth;
    this._canvasElement.height = this._canvasElement.clientHeight;
    this._bounds = new Rectangle(
      new Vector2(
        -this._canvasElement.width / this._canvasElement.height * this._scale / 2,
        this._canvasElement.height / this._canvasElement.height * this._scale / 2
      ),
      new Vector2(
        this._canvasElement.width / this._canvasElement.height * this._scale / 2,
        -this._canvasElement.height / this._canvasElement.height * this._scale / 2
      )
    );
    this._canvasBounds = new Rectangle(
      new Vector2(0, 0),
      new Vector2(this._canvasElement.width, this._canvasElement.height)
    );
  }

  public set scale(scale: number) {
    this._scale = scale;
    this.resetBounds();
  }

  private clear() {
    this._context.fillStyle = Colors.backgroundColor.value.toCSS(false);
    this._context.fillRect(0, 0, this._canvasElement.width, this._canvasElement.height);
  }

  private beginLoop() {
    let sentTime: number = new Date().getTime() / 1000.0;
    const DT: number = 1 / 60;

    const loop = () => {
      this.clear();

      if (!this._paused) {
        const t: number = new Date().getTime() / 1000.0;

        if (t - sentTime > 1) {
          sentTime = t;
        }

        let done: number = 0;
        while (sentTime < t && done < 3) {
          sentTime += DT;
          for (let object of this._objects) {
            object.update(DT, t);
          }
          done += 1;
        }

        this._objects.sort((a, b) => (a.zIndex > b.zIndex) ? 1 : -1)
        for (let object of this._objects) {
          object.draw(this._context, this._bounds, this._canvasBounds);
        }
      } else {
        sentTime = new Date().getTime() / 1000.0;
      }

      for (let object of this._objects) {
        object.draw(this._context, this._bounds, this._canvasBounds);
      }

      window.requestAnimationFrame(loop);
    }
    loop();
  }

  public addObject(object: CanvasObject): void {
    this._objects.push(object);
  }

  public removeOBject(object: CanvasObject): void {
    const index: number = this._objects.indexOf(object);
    if (index > -1) {
      this._objects.splice(index, 1);
    }
  }

  public get canvasElement(): HTMLCanvasElement {
    return this._canvasElement;
  }

  public get bounds(): Rectangle {
    return this._bounds;
  }

  public get canvasBounds(): Rectangle {
    return this._canvasBounds;
  }

  public play(): void {
    this._paused = false;
  }

  public pause(): void {
    this._paused = true;
  }

  public get paused(): boolean {
    return this._paused;
  }
}
