import { Rectangle, CanvasObject, Canvas, Vector2, Colors } from 'vima';

(function() {

function getParameters(url: string): {[key: string]: string} {
  const params: {[key: string]: string} = {};
  const parser: HTMLAnchorElement = document.createElement('a');
  parser.href = url;
  const query: string = parser.search.substring(1);
  const vars: Array<string> = query.split('&');
  for (let v of vars) {
    var pair: Array<string> = v.split('=');
    params[pair[0]] = decodeURIComponent(pair[1]);
  }
  return params;
};

class ConstraintDistance {

  private _particle1: VerletParticle;
  private _particle2: VerletParticle;
  private _minDistance: number;
  private _maxDistance: number;

  constructor(particle1:   VerletParticle,
              particle2:   VerletParticle,
              minDistance: number,
              maxDistance: number)
  {
    this._particle1 = particle1;
    this._particle2 = particle2;
    this._minDistance = minDistance;
    this._maxDistance = maxDistance;
  }

  public relax() {
    const difference: Vector2 =
      this._particle2.position.subtract(
        this._particle1.position
      );

    const distance: number = difference.length();
    const direction: Vector2 = difference.normalize();

    let error: number = 0;

    if (distance < this._minDistance) {
      error = distance - this._minDistance;
    } else if (this._maxDistance < distance) {
      error = distance - this._maxDistance;
    }

    const totalMass: number = (this._particle1.mass + this._particle2.mass)
    let w1: number = this._particle1.mass / totalMass;
    let w2: number = 1 - w1;

    if (this._particle1.fixed && this._particle2.fixed) {
      w1 = w2 = 0;
    } else if (this._particle1.fixed) {
      w1 = 0; w2 = 1;
    } else if (this._particle2.fixed) {
      w1 = 1; w2 = 0;
    }

    this._particle1.position =
      this._particle1.position.add(direction.multiply(+error * w1));
    this._particle2.position =
      this._particle2.position.add(direction.multiply(-error * w2));
  }
}

class VerletParticle {

  private _previousPosition: Vector2;
  private _position: Vector2;
  private _acceleration: Vector2;
  public mass: number = 1;
  public fill: boolean = false;
  public fixed: boolean = false;

  constructor(position: Vector2, acceleration: Vector2 = new Vector2(0, 0)) {
    this._previousPosition = this._position = position;
    this._acceleration = acceleration;
  }

  public set position(position: Vector2) {
    this._position = position;
  }

  public set acceleration(acceleration: Vector2) {
    this._acceleration = acceleration;
  }

  public get position(): Vector2 {
    return this._position;
  }

  public update(dt: number) {
    if (this.fixed) return;
    const previousPoisition = this._position;
    this._position = this._position
      .multiply(2)
      .subtract(this._previousPosition)
      .add(this._acceleration.multiply(dt * dt));
    this._previousPosition  = previousPoisition;
  }

  public draw(context:      CanvasRenderingContext2D,
              bounds:       Rectangle,
              canvasBounds: Rectangle)
  {

    if (!this.fixed) return;

    const canvasPosition: Vector2 =
      this.position.coordinatesTransform(bounds, canvasBounds);
    context.fillStyle = this.fill ? Colors.blueColor.toCSS():
                                    Colors.backgroundColor.toCSS();
    context.beginPath();
    context.arc(canvasPosition.x, canvasPosition.y, 10, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
  }
}

abstract class SoftBodyObject extends CanvasObject {
  protected _particles: Array<VerletParticle> = [];
  protected _constraints: Array<ConstraintDistance> = [];

  constructor() {
    super();
  }

  public get particles(): readonly VerletParticle[] {
    return Object.freeze(this._particles);
  }
}

class ClothObject extends SoftBodyObject {

  private readonly COLUMNS_COUNT: number = 15;
  private readonly ROWS_COUNT: number = 25;

  constructor() {
    super();

    this._particles = [];

    // Create a square shaped cloth

    const squareSize: number = canvas.bounds.height / 2;
    const horizontalSpacing: number = squareSize / this.COLUMNS_COUNT;
    const verticalSpacing: number = squareSize / this.ROWS_COUNT;

    for (let i = 0; i < this.ROWS_COUNT; ++i) {
      for (let j = 0; j < this.COLUMNS_COUNT; ++j) {
        this._particles.push(
          new VerletParticle(
            new Vector2(
              canvas.bounds.center.x + j * horizontalSpacing - squareSize / 2,
              canvas.bounds.center.y - i * verticalSpacing + squareSize / 2
            )
          )
        );
      }
    }

    for (let i = 0; i < this.COLUMNS_COUNT * this.ROWS_COUNT; ++i) {
      const thisParticle: VerletParticle = this._particles[i];

      // To the right
      if ((i + 1) % this.COLUMNS_COUNT > 0 &&
          i + 1 < this.COLUMNS_COUNT * this.ROWS_COUNT)
      {
        const thatParticle: VerletParticle = this._particles[i + 1];
        this._constraints.push(
          new ConstraintDistance(
            thisParticle,
            thatParticle,
            0,
            horizontalSpacing
          )
        );
      }

      // Below
      if (i + this.COLUMNS_COUNT < this.COLUMNS_COUNT * this.ROWS_COUNT) {
        const thatIndex: number = i + this.COLUMNS_COUNT;
        const thatParticle: VerletParticle = this._particles[thatIndex];
        this._constraints.push(
          new ConstraintDistance(
            thisParticle,
            thatParticle,
            0,
            verticalSpacing
          )
        );
      }
    }

    for (let j = 0; j < 5; ++j) {
      for (let jump = 1; jump <= 1; ++jump) {
        for (let i = jump; i < this.COLUMNS_COUNT; ++i) {
          const thisParticle: VerletParticle = this._particles[i];
          const thatParticle: VerletParticle = this._particles[i - jump];
          this._constraints.push(
            new ConstraintDistance(
              thisParticle,
              thatParticle,
              0,
              horizontalSpacing * 0.8
            )
          );
        }
      }
    }

    this._particles[0].fixed = true;
    this._particles[this.COLUMNS_COUNT - 1].fixed = true;
  }

  public draw(context:      CanvasRenderingContext2D,
              bounds:       Rectangle,
              canvasBounds: Rectangle): void
  {
    context.strokeStyle = Colors.blueColor.toCSS();
    context.lineCap = 'round';
    context.lineWidth = 2;

    for (let row = 0; row < this.ROWS_COUNT; ++row) {
      context.beginPath();
      for (let column = 0; column < this.COLUMNS_COUNT; ++column) {
        const canvasPosition: Vector2 =
          this._particles[row * this.COLUMNS_COUNT + column].position.coordinatesTransform(bounds, canvasBounds);
        context.lineTo(canvasPosition.x, canvasPosition.y);
      }
      context.stroke();
    }

    for (let column = 0; column < this.COLUMNS_COUNT; ++column) {
      context.beginPath();
      for (let row = 0; row < this.ROWS_COUNT; ++row) {
        const canvasPosition: Vector2 =
          this._particles[row * this.COLUMNS_COUNT + column].position.coordinatesTransform(bounds, canvasBounds);
        context.lineTo(canvasPosition.x, canvasPosition.y);
      }
      context.stroke();
    }

    for (let particle of this._particles) {
      particle.draw(context, bounds, canvasBounds);
    }
  }

  public update(dt: number, time: number): void {
    for (let particle of this._particles) {
      particle.acceleration = new Vector2(3 * Math.sin(time) + 3, -30);
      particle.update(dt);
    }

    for (let i = 0; i < 30; ++i) {
      for (let constraint of this._constraints) {
        constraint.relax();
      }
    }
  }
}

class RopeObject extends SoftBodyObject {
  constructor() {
    super();

    const PARTICLES_COUNT: number = 75;
    const DISTANCE: number = 1 / 75 * canvas.bounds.height * 0.5;
    const INCREMENT_V: Vector2 = new Vector2(0, -DISTANCE);

    this._particles = [
      new VerletParticle(
        new Vector2(
          canvas.bounds.center.x,
          canvas.bounds.center.y + PARTICLES_COUNT * DISTANCE / 2
        )
      )
    ];

    while (this._particles.length < 75) {
      const previousParticle: VerletParticle =
        this._particles[this._particles.length - 1];
      this._particles.push(
        new VerletParticle(
          previousParticle.position.add(INCREMENT_V)
        )
      );
    }

    this._particles[0].fixed = true;

    this._constraints = new Array<ConstraintDistance>();

    for (let jump = 1; jump <= 10; ++jump) {
      for (let i = jump; i < PARTICLES_COUNT; ++i) {
        this._constraints.push(
          new ConstraintDistance(
            this._particles[i],
            this._particles[i - jump],
            0, DISTANCE * jump
          )
        );
      }
    }
  }

  public draw(context:      CanvasRenderingContext2D,
              bounds:       Rectangle,
              canvasBounds: Rectangle): void
  {
    context.strokeStyle = Colors.blueColor.toCSS();
    context.lineCap = 'round';
    context.lineWidth = 2;

    context.beginPath();
    for (let particle of this._particles) {
      const canvasPosition: Vector2 =
        particle.position.coordinatesTransform(bounds, canvasBounds);
      context.lineTo(canvasPosition.x, canvasPosition.y);
    }
    context.stroke();

    for (let particle of this._particles) {
      particle.draw(context, bounds, canvasBounds);
    }
  }

  public update(dt: number, time: number): void {
    for (let particle of this._particles) {
      particle.acceleration = new Vector2(3 * Math.sin(time) + 3, -30);
      particle.update(dt);
    }

    for (let i = 0; i < 30; ++i) {
      for (let constraint of this._constraints) {
        constraint.relax();
      }
    }

  }
}

const canvas: Canvas = new Canvas('canvas');
const params = getParameters(window.location.href);

if (params['type'] === 'cloth') {
  var softBody: SoftBodyObject = new ClothObject();
} else {
  var softBody: SoftBodyObject = new RopeObject();
}
canvas.addObject(softBody);

let mouseDownParticle: VerletParticle | undefined = undefined;
const HANDLE_RADIUS: number = 10;

window.document.addEventListener('mousedown', (event: MouseEvent) => {
  if (canvas.paused) return;

  const [x, y] = [
    event.pageX - canvas.canvasElement.offsetLeft,
    event.pageY - canvas.canvasElement.offsetTop
  ];
  const p1: Vector2 = new Vector2(x, y);

  for (let particle of softBody.particles) {
    if (particle.fixed == true) {
      const p2: Vector2 = particle.position.coordinatesTransform(canvas.bounds, canvas.canvasBounds);
      if (p1.distance(p2) < 2 * HANDLE_RADIUS) {
        mouseDownParticle = particle;
        mouseDownParticle.fill = true;
        document.body.style.cursor = 'grabbing';
        break;
      }
    }
  }
});

window.document.addEventListener('mouseup', (event: MouseEvent) => {
  if (mouseDownParticle !== undefined) {
    mouseDownParticle.fill = false;
    mouseDownParticle = undefined;
  }

  const [x, y] = [
    event.pageX - canvas.canvasElement.offsetLeft,
    event.pageY - canvas.canvasElement.offsetTop
  ];
  const p1: Vector2 = new Vector2(x, y);

  for (let particle of softBody.particles) {
    if (particle.fixed == true) {
      const p2: Vector2 = particle.position.coordinatesTransform(canvas.bounds, canvas.canvasBounds);
      if (p1.distance(p2) < 2 * HANDLE_RADIUS) {
        particle.fill = true;
        document.body.style.cursor = 'grab';
        break;
      }
    }
  }
});

window.document.addEventListener('mousemove', (event: MouseEvent) => {
  if (canvas.paused) return;

  const [x, y] = [
    event.pageX - canvas.canvasElement.offsetLeft,
    event.pageY - canvas.canvasElement.offsetTop
  ];
  if (mouseDownParticle !== undefined) {
    mouseDownParticle.position = new Vector2(x, y)
      .coordinatesTransform(canvas.canvasBounds, canvas.bounds);
    document.body.style.cursor = 'grabbing';
  } else {
    const p1: Vector2 = new Vector2(x, y);
    for (let particle of softBody.particles) {
      particle.fill = false;
    }
    document.body.style.cursor = '';
    for (let particle of softBody.particles) {
      if (particle.fixed == true) {
        const p2: Vector2 = particle.position.coordinatesTransform(canvas.bounds, canvas.canvasBounds);
        if (p1.distance(p2) < 2 * HANDLE_RADIUS) {
          particle.fill = true;
          document.body.style.cursor = 'grab';
          break;
        }
      }
    }
  }
});

window.document.addEventListener('touchstart', (event: TouchEvent): void => {
  if (canvas.paused) return;

  const [x, y] = [
    event.touches[0].pageX - canvas.canvasElement.offsetLeft,
    event.touches[0].pageY - canvas.canvasElement.offsetTop
  ];
  const p1: Vector2 = new Vector2(x, y);

  for (let particle of softBody.particles) {
    if (particle.fixed == true) {
      const p2: Vector2 = particle.position.coordinatesTransform(
        canvas.bounds, canvas.canvasBounds
      );
      if (p1.distance(p2) < 2 * HANDLE_RADIUS) {
        mouseDownParticle = particle;
        mouseDownParticle.fill = true;
        break;
      }
    }
  }
});

window.document.addEventListener('touchmove', (event: TouchEvent): void => {
  if (canvas.paused) return;
  if (!event.cancelable) return;
  event.preventDefault();

  const [x, y] = [
    event.touches[0].pageX - canvas.canvasElement.offsetLeft,
    event.touches[0].pageY - canvas.canvasElement.offsetTop
  ];

  if (mouseDownParticle !== undefined) {
    mouseDownParticle.position = new Vector2(x, y)
      .coordinatesTransform(canvas.canvasBounds, canvas.bounds);
  }
});

window.document.addEventListener('touchend', () => {
  if (mouseDownParticle !== undefined) {
    mouseDownParticle.fill = false;
    mouseDownParticle = undefined;
  }
});

window.addEventListener('message', (event: MessageEvent) => {
  switch (event.data) {
    case 'rope':
      canvas.removeOBject(softBody);
      softBody = new RopeObject();
      canvas.addObject(softBody);
      break;
    case 'cloth':
      canvas.removeOBject(softBody);
      softBody = new ClothObject();
      canvas.addObject(softBody);
      break;
  }
});


})();
