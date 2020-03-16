import * as vima from 'vima';

const NODES = 20;

interface PointWithMetadata {
  graphic: vima.FreePointGraphic;
  previousPosition: vima.Vector2;
  grabbed: boolean;
}

const bounds: vima.Rectangle = new vima.Rectangle(
  new vima.Vector2(-20.4, 10.2), new vima.Vector2(20.4, -10.2));

const graphingCalculator: vima.GraphingCalculator =
  new vima.GraphingCalculator('canvas', bounds);

const points: Array<PointWithMetadata> = []

for (let i = 0; i < NODES; ++i) {
  const virtualHeight = bounds.height * 0.75;
  const position = new vima.Vector2(
    0,
    bounds.bottom + virtualHeight / NODES * (i + 1) - (virtualHeight / NODES) / 2
  )
  const graphic = new vima.FreePointGraphic({
    x: position.x,
    y: position.y,
    type: i < NODES - 1 ? vima.PointGraphicType.Triangle : vima.PointGraphicType.Circle,
    interactive: false
  });
  const point = {
    graphic: graphic,
    previousPosition: position,
    grabbed: i == NODES - 1
  }
  points.push(point);
  graphic.on('mousedrag', (e: any) => {
    point.grabbed = true;
    graphic.position = new vima.Vector2(e.point.x, e.point.y);
  });
  graphic.on('mousedown', () => {
    point.grabbed = true;
  });
}

for (let i = 1; i < NODES; ++i) {
  const vector = new vima.VectorGraphic(points[i].graphic, points[i - 1].graphic);
  graphingCalculator.add(vector);
}

for (let point of points) {
  graphingCalculator.add(point.graphic);
}

let myTime = 0;
let time = 0;

const DELTA = 1 / 30;
const ACC = -100;
const DISTANCE = 0.5;

function tick() {
  for (let point of points) {
    if (point.grabbed) continue;
    const x = 2 * point.graphic.position.x - point.previousPosition.x;
    const y = 2 * point.graphic.position.y - point.previousPosition.y + DELTA * DELTA * ACC;
    point.previousPosition = point.graphic.position;
    point.graphic.position = new vima.Vector2(x, y);
  }
  for (let _ = 0; _ < 20; ++_) {
    for (let i = 1; i < NODES; ++i) {
      const p1 = points[i];
      const p2 = points[i - 1];
      const dist = p1.graphic.position.distance(p2.graphic.position);
      const deltad = DISTANCE - dist;
      const r = p2.graphic.position.subtract(p1.graphic.position).normalize();

      let np1 = p1.graphic.position;
      let np2 = p2.graphic.position;

      if (!p1.grabbed && !p2.grabbed) {
        np1 = p1.graphic.position.subtract(r.multiply(deltad / 2));
        np2 = p2.graphic.position.add(r.multiply(deltad / 2));
      } else if (p1.grabbed && !p2.grabbed) {
        np2 = p2.graphic.position.add(r.multiply(deltad));
      } else if (!p1.grabbed && p2.grabbed) {
        np1 = p1.graphic.position.subtract(r.multiply(deltad));
      }

      p1.graphic.position = np1;
      p2.graphic.position = np2;
    }
  }
}

graphingCalculator.on('frame', ({delta}) => {
  if (delta > 1) return;
  time += delta;
  while (myTime < time) {
    tick();
    myTime += DELTA;
  }
});
