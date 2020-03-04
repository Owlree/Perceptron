import * as vima from 'vima';

// Create an instance of the graphing calculator
const graphingCalculator = new vima.GraphingCalculator('canvas');

// Create the main function
const functionGraphic: vima.FunctionGraphic =
  new vima.FunctionGraphic('sin(x)', {
    strokeWidth: 0.015
  });

// Create a point that is constrained to stay on the main function graphic
const tangentPoint = new vima.ConstrainedPointFunctionGraphic(
  functionGraphic, {
    radius: 5
  });

// Create a variable that extracts the tangent point's abscissa
const tangentPointX: vima.WritableVariable<number> =
  new vima.WritableVariable<number>(tangentPoint.position.x);
tangentPoint.positionVariable.register(
  (variable: vima.Variable<vima.Vector2>): void => {
    tangentPointX.value = variable.value.x;
  });

// Create a tangent line to the function at the tangent point's abscissa
const tangentGraphic: vima.FunctionGraphic = new vima.FunctionGraphic(
  'cos(p) * x + sin(p) - cos(p) * p', {
    variables: {
      p: tangentPointX
    },
    strokeColor: vima.Colors.blueColor,
    strokeWidth: 0.015
  });

let dt: number = 1;

// Create a variable that follows the tangent point's abscissa plus dt
let xPlusDt: vima.WritableVariable<number> =
  new vima.WritableVariable<number>(0.5);
tangentPoint.positionVariable.register(
  (variable: vima.Variable<vima.Vector2>): void => {
    xPlusDt.value = variable.value.x + dt;
  });

// Create a point constrained on the function graphic at x + dt
const constrainedPointFunction = new vima.ConstrainedPointFunctionGraphic(
  functionGraphic, {
    x: xPlusDt,
    radius: 5,
    color: vima.Colors.redColor,
    // interactive: false
  });

// Create a point constrained on the tangent graphic at x + dt
const constrainedPointTangent = new vima.ConstrainedPointFunctionGraphic(
  tangentGraphic, {
    x: xPlusDt,
    radius: 5,
    color: vima.Colors.redColor,
    // interactive: false
  });

// Create a vector that highlights the difference between the point on the
// function and its approximation via the tangent
const errorVector: vima.VectorGraphic = new vima.VectorGraphic(
  constrainedPointFunction, constrainedPointTangent, {
    color: vima.Colors.redColor,
    strokeWidth: 0.03
  });

// Add the function graphic to the calculator
graphingCalculator.add(functionGraphic);

// Add the tangent graphic to the calculator
graphingCalculator.add(tangentGraphic);

// Add the tangent point to the graphic
graphingCalculator.add(tangentPoint);

// Add the error vector to the calculator
graphingCalculator.add(errorVector);

// Add the error vector controllers to the calculator
graphingCalculator.add(constrainedPointFunction);
graphingCalculator.add(constrainedPointTangent);

errorVector.on('mousedrag', (event: any): void => {
  xPlusDt.value = event.point.x;
  dt = xPlusDt.value - tangentPoint.position.x;
});

constrainedPointFunction.on('mousedrag', (event: any): void => {
  xPlusDt.value = event.point.x;
  dt = xPlusDt.value - tangentPoint.position.x;
});

constrainedPointTangent.on('mousedrag', (event: any): void => {
  xPlusDt.value = event.point.x;
  dt = xPlusDt.value - tangentPoint.position.x;
});

const text = new vima.TextGraphic('f(x)+Δxf\'(x)', constrainedPointTangent.positionVariable, new vima.Vector2(0, 0));
graphingCalculator.add(text);

tangentPointX.register((variable: vima.Variable<number>): void => {
  const angle: number = Math.atan(Math.cos(variable.value));
  text.rotation = angle * 180 / Math.PI;

  if (constrainedPointTangent.position.y > constrainedPointFunction.position.y) {
    text.offset = new vima.Vector2(-0.1 * Math.sin(angle), 0.1 * Math.cos(angle));
  } else {
    text.offset = new vima.Vector2(0.1 * Math.sin(angle), -0.1 * Math.cos(angle));
  }
});

// let i = 0;
// function loop() {
//   text.rotation = i;
//   i += 1;
//   requestAnimationFrame(loop);
// }
// loop();
