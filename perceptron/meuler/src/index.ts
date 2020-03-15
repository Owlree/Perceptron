import * as vima from 'vima';

const bounds: vima.Rectangle = new vima.Rectangle(
  new vima.Vector2(-5, 5), new vima.Vector2(5, -5));

// Default position chosen to highlight differences between exact and
// approximate solutions
const defaultPosition: vima.Vector2 = new vima.Vector2(
  -0.44459644322845415, -0.6417489421720733);

// Create an instance of the graphing calculator
const graphingCalculator = new vima.GraphingCalculator('canvas', bounds);

// Create a slope field
const slopeField = new vima.SlopeField('cos(x) + y', bounds);
graphingCalculator.add(slopeField);

// Returns the constant for the exact solution of the differential equation
// based on the initial condition
const getC = (position: vima.Vector2): number => {
  let [x, y] = position.array;
  return 1 / 2 * Math.exp(-x) * (Math.cos(x) - Math.sin(x) + 2 * y);
}

// Create a point that represents the initial condition
const initialConditionPoint = new vima.FreePointGraphic({
  x: defaultPosition.x, y: defaultPosition.y
});

// Create a variable that follows getC(initial condition)
const cVariable = new vima.WritableVariable<number>(
  getC(initialConditionPoint.position));
initialConditionPoint.positionVariable.register(
  (variable: vima.Variable<vima.Vector2>) => {
    cVariable.value = getC(variable.value);
  }
);

// Create a function graphic that represents the exact solution to the
// differential equation
const exactSolution = new vima.FunctionGraphic(
  'c * e^x + sin(x) / 2 - cos(x) / 2', {
  variables: {
    c: cVariable // variable depedendent on the initial condition
  },
  strokeColor: vima.Colors.blueColor,
  strokeWidth: 0.05
});
graphingCalculator.add(exactSolution);

graphingCalculator.add(initialConditionPoint);

// Synchronize the approximate solution start point with the initial condition
// point
slopeField.solutionPosition = initialConditionPoint.positionVariable;

// On touch devices use the entire canvas to move the initial condition point
let touching: boolean = true;
graphingCalculator.canvas.addEventListener('touchstart', (): void => {
  touching = true;
  initialConditionPoint.position = graphingCalculator.mousePosition;
});
graphingCalculator.canvas.addEventListener('touchmove', (): void => {
  if (touching) {
    initialConditionPoint.position = graphingCalculator.mousePosition;
  }
});
graphingCalculator.canvas.addEventListener('touchend', (): void => {
  touching = false;
});
