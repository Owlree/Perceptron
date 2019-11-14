import * as paper from 'paper';

/**
 * Returns a subset of the graph of a given one variable function, with points
 * having equally spaced abscissae.
 *
 * @param f The function to compute the points for
 * @param from Minimum abscissa of a point in the set
 * @param to Maximum absissa of a point in the set
 * @param resolution Distance between two consecutive points, defaults
 *                            to (to - from) / 100
 */
export function GetPoints(
  f: (x: number) => number,
  from: number, to: number, resolution?: number): paper.Point[] {

  let points: paper.Point[] = [];
  resolution = resolution || (to - from) / 100;

  for (let x = from; x <= to + resolution; x += resolution) {
    points.push(new paper.Point(x, f(x)));
  }

  return points;
}

/**
 * Returns a one variable function representing the approximation of the tanget
 * of the given function at the given point.
 *
 * @param f The function to compute the tangent for
 * @param x The point at which to compute the tangent
 * @param delta Distance between approxiation points
 */
export function GetApproximateTangent(
    f: (x: number) => number,
    x: number, delta: number = 0.1): ((x: number) => number) {
    const a = new paper.Point(x - delta / 2, f(x - delta / 2));
    const b = new paper.Point(x + delta / 2, f(x + delta / 2));

    const slope: number = (b.y - a.y) / (b.x - a.x);
    const intercept: number = a.y - slope * a.x;

    return (x: number) => slope * x + intercept;
}
