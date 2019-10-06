import * as paper from 'paper';

const Colors = {
    Frangipan: new paper.Color('#FFDDBB'),
    SpringGreen: new paper.Color('#33FFAA')
};

function GetPoints(
  f: (x: number) => number,
  from: number, to: number, resolution?: number): paper.Point[] {

  let points: paper.Point[] = [];
  resolution = resolution || (to - from) / 100;

  for (let x = from; x < to; x += resolution) {
    points.push(new paper.Point(x, f(x)));
  }

  return points;
}

function GetApproximateTangent(
    f: (x: number) => number,
    x: number, delta: number = 0.1): ((x: number) => number) {
    const a = new paper.Point(x - delta, f(x - delta));
    const b = new paper.Point(x + delta, f(x + delta));

    const slope: number = (b.y - a.y) / (b.x - a.x);
    const intercept: number = a.y - slope * a.x;

    return (x: number) => slope * x + intercept;
}

const render = () => {

  paper.setup('myCanvas');

  console.log(paper.view.bounds, paper.view.size);

  paper.view.transform(new paper.Matrix(
    paper.view.viewSize.width / (2 * Math.PI), 0,
    0, -paper.view.viewSize.height / 4,
    paper.view.viewSize.width / 2, paper.view.viewSize.height / 2));

  console.log(paper.view.bounds, paper.view.size);

  {
    const path = new paper.Path(GetPoints(Math.sin, -Math.PI, Math.PI));
    path.strokeColor = Colors.Frangipan;
    path.strokeWidth = paper.view.bounds.height / 500;
  }

  {
    const path = new paper.Path(
      GetPoints(
        GetApproximateTangent(Math.sin, 0, 0.001),
        paper.view.bounds.left, paper.view.bounds.right));
    path.strokeColor = Colors.SpringGreen;
    path.strokeWidth = paper.view.bounds.height / 500;

    const handle = (e: paper.MouseEvent) => {
      path.removeSegments();
      path.add(
        ...GetPoints(
          GetApproximateTangent(Math.sin, e.point.x, 0.001),
          paper.view.bounds.left, paper.view.bounds.right));
    };

    paper.view.on('mousedrag', handle);
    paper.view.on('mousedown', handle);
  }
};

window.addEventListener('load', render);