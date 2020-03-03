import * as vima from 'vima';

const graphingCalculator = new vima.GraphingCalculator('canvas');

// Create the main function
const functionGraphic: vima.FunctionGraphic = new vima.FunctionGraphic('sin(x)', {
  strokeWidth: 0.015
});

// Create a point that is constrained to stay on the main function graphic
const constrainedPoint = new vima.ConstrainedPointFunctionGraphic(functionGraphic, {
  radius: 5
});

const xVariable = new vima.WritableVariable<number>(constrainedPoint.position.x);
constrainedPoint.positionVariable.register((variable: vima.Variable<vima.Vector2>): void => {
  xVariable.value = variable.value.x;
});

// Create a tangent line at a variable point
const tangent: vima.FunctionGraphic = new vima.FunctionGraphic(
  'cos(p) * x + sin(p) - cos(p) * p', {
    variables: {
      p: xVariable
    },
    strokeColor: vima.Colors.blueColor,
    strokeWidth: 0.015
  });

let xvar = new vima.WritableVariable<number>(0.5);

const constrainedPoint1 = new vima.ConstrainedPointFunctionGraphic(functionGraphic, {
  x: xvar,
  interactive: false,
  radius: 5,
  color: vima.Colors.redColor
});
const constrainedPoint2 = new vima.ConstrainedPointFunctionGraphic(tangent, {
  x: xvar,
  interactive: false,
  radius: 5,
  color: vima.Colors.redColor
});

constrainedPoint.positionVariable.register((variable: vima.Variable<vima.Vector2>): void => {
  xvar.value = variable.value.x + 1;
});

// Add both of them to the graphing calculator
graphingCalculator.add(functionGraphic);
graphingCalculator.add(tangent);
graphingCalculator.add(constrainedPoint);
graphingCalculator.add(new vima.VectorGraphic(constrainedPoint1, constrainedPoint2, {
  color: vima.Colors.redColor,
  strokeWidth: 0.03
}));
graphingCalculator.add(constrainedPoint1);
graphingCalculator.add(constrainedPoint2);
