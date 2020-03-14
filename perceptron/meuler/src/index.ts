import * as vima from 'vima';

const bounds: vima.Rectangle = new vima.Rectangle(
  new vima.Vector2(-5, 5), new vima.Vector2(5, -5));

const defaultPosition: vima.Vector2 = new vima.Vector2(-0.44459644322845415, -0.6417489421720733);

// Create an instance of the graphing calculator
const graphingCalculator = new vima.GraphingCalculator('canvas', bounds);

const slopeField = new vima.SlopeField('cos(x) + y', bounds);
graphingCalculator.add(slopeField);

function getC(position: vima.Vector2): number {
  let [x, y] = position.array;
  return 1 / 2 * Math.exp(-x) * (Math.cos(x) - Math.sin(x) + 2 * y);
}

const point = new vima.FreePointGraphic({
  x: defaultPosition.x, y: defaultPosition.y
});

const cVariable = new vima.WritableVariable<number>(getC(point.position));

const fn = new vima.FunctionGraphic('c * e^x + sin(x) / 2 - cos(x) / 2', {
  variables: {
    c: cVariable
  },
  strokeColor: vima.Colors.blueColor,
  strokeWidth: 0.05
});
graphingCalculator.add(fn);
graphingCalculator.add(point);

slopeField.solutionPosition = point.positionVariable;

point.positionVariable.register((variable: vima.Variable<vima.Vector2>) => {
  cVariable.value = getC(variable.value);
});

let touching: boolean = true;

function touchDown(_: TouchEvent) {
  touching = true;
  point.position = graphingCalculator.mousePosition;
}

function touchMove(_: TouchEvent) {
  if (touching) {
    point.position = graphingCalculator.mousePosition;
  }
}

function touchUp(_: TouchEvent) {
  touching = false;
}

// Add support for touch interaction
graphingCalculator.canvas.addEventListener('touchstart', touchDown);
graphingCalculator.canvas.addEventListener('touchmove', touchMove);
graphingCalculator.canvas.addEventListener('touchend', touchUp);