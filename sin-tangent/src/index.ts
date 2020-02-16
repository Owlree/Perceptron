import * as paper from 'paper';
import * as math from 'mathjs';

import * as themes from './themes';

paper.setup('canvas');

const functionPath: paper.Path = new paper.Path();
const tangentPath: paper.Path = new paper.Path();
const fn: math.EvalFunction = math.parse('sin(x)').compile();
const dr: math.EvalFunction = math.derivative('sin(x)', 'x');
const line: math.EvalFunction = math.parse('m * x + b');
const backgroundRectangle: paper.Rectangle = new paper.Rectangle(
 new paper.Point(0, 0), new paper.Point(100, 100));
const backgroundPath: paper.Shape.Rectangle =
  new paper.Shape.Rectangle(backgroundRectangle);
backgroundPath.sendToBack();
let mousePosition: paper.Point = new paper.Point(0, 0);

/**
 * @param fn Function to evaluate
 * @param from First point to evaluate
 * @param to Last point to evaluate
 * @count How many points to evaluate
 * @scope Scope to pass through to the function (x will be overriden)
 * @returns A list of values of function {@code fn} evaluated at {@code count}
 */
function getSegments(
  fn: math.EvalFunction, from: number, to: number, count: number,
  scope: object = {}): paper.Segment[] {

  const segments: paper.Segment[] = [];
  for (let x = from; x <= to; x += (to - from) / count) {
    const y: number = fn.evaluate({...scope, x: x});
    const point: paper.Point = new paper.Point(x, y);
    segments.push(new paper.Segment(point));
  }
  return segments;
}

/**
 * Sets up the path of the main function.
 */
function setupFunction(): void {
  functionPath.strokeWidth = 1 / paper.view.viewSize.height * 2;
  functionPath.removeSegments();
  const left: number = paper.view.bounds.left;
  const right: number = paper.view.bounds.right;
  functionPath.addSegments(getSegments(fn, left, right, 100));
}

/**
 * Sets up the path of the tangent.
 * @param point Where to compute the tangent on the main function
 */
function setupTangent(): void {
  tangentPath.strokeWidth = 1 / paper.view.viewSize.height * 2;
  tangentPath.removeSegments();
  const left: number = paper.view.bounds.left;
  const right: number = paper.view.bounds.right;
  const slope: number = dr.evaluate({x: mousePosition.x});
  tangentPath.addSegments(getSegments(line, left, right, 2, {
    m: slope,
    b: fn.evaluate({x: mousePosition.x}) - slope * mousePosition.x
  }));
}

/**
 * Performs initial / resize setup.
 */
function setup() {
  const width: number = paper.view.viewSize.width;
  const height: number = paper.view.viewSize.height;
  const size: number = Math.min(width, height);
  paper.view.transform(paper.view.matrix.inverted());
  paper.view.transform(new paper.Matrix(
    size / Math.PI, 0,
    0, -size / Math.PI,
    width / 2, height / 2
  ));

  setupFunction();
  setupTangent();

  backgroundPath.position = paper.view.bounds.center;
  backgroundPath.size = paper.view.size;
}

/**
 * @param theme Theme to activate
 */
function activateTheme(theme: themes.Theme): void {
  functionPath.strokeColor = theme.Main;
  tangentPath.strokeColor = theme.Blue;
  backgroundPath.fillColor = theme.Background;
}

/**
 * Activates dark mode.
 */
function activateDarkMode(): void {
  activateTheme(themes.DarkTheme);
}

/**
 * Activates light mode.
 */
function activateLightMode(): void {
  activateTheme(themes.LightTheme);
}

// Setup light / dark mode based on client preference
(function(): void {
  const isDarkMode =
    window.matchMedia("(prefers-color-scheme: dark)").matches
  const isLightMode =
    window.matchMedia("(prefers-color-scheme: light)").matches
  const isNotSpecified =
    window.matchMedia("(prefers-color-scheme: no-preference)").matches
  const hasNoSupport = !isDarkMode && !isLightMode && !isNotSpecified;
  window.matchMedia("(prefers-color-scheme: dark)")
    .addListener(e => e.matches && activateDarkMode());
  window.matchMedia("(prefers-color-scheme: light)")
    .addListener(e => e.matches && activateLightMode());
  if(isDarkMode) activateDarkMode()
  if(isLightMode) activateLightMode()
  if(isNotSpecified || hasNoSupport) {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 4 || hour >= 16) {
      activateDarkMode();
    }
  }
})();

paper.view.on('resize', setup);
setup();

let mouseDown: boolean = false;
paper.view.on('mousedown', () => {
  setupTangent();
  mouseDown = true;
});
paper.view.on('mouseup', () => { mouseDown = false; });
paper.view.on('mousemove', (event: paper.MouseEvent) => {
  mousePosition = event.point;
  if (mouseDown === true) {
    setupTangent();
  }
});
