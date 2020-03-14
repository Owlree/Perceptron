import * as vima from 'vima';

const bounds: vima.Rectangle = new vima.Rectangle(
  new vima.Vector2(-5, 5), new vima.Vector2(5, -5));

// Create an instance of the graphing calculator
const graphingCalculator = new vima.GraphingCalculator('canvas', bounds);

const slopeField = new vima.SlopeField('cos(x) + y', bounds);
graphingCalculator.add(slopeField);

const cVariable = new vima.WritableVariable<number>(0);

const fn = new vima.FunctionGraphic('c * e^x + sin(x) / 2 - cos(x) / 2', {
  variables: {
    c: cVariable
  },
  strokeColor: vima.Colors.blueColor
});
graphingCalculator.add(fn);

const point = new vima.FreePointGraphic();
graphingCalculator.add(point);

slopeField.solutionPosition = point.positionVariable;

point.positionVariable.register((variable: vima.Variable<vima.Vector2>) => {
  let [x, y] = variable.value.array;
  cVariable.value = 1 / 2 * Math.exp(-x) * (Math.cos(x) - Math.sin(x) + 2 * y);
});
