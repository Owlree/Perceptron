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

tangentPoint.position = new vima.Vector2(-Math.PI / 3, 0);

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

// Add all elements to the calculator
graphingCalculator.add(functionGraphic);
graphingCalculator.add(tangentGraphic);
graphingCalculator.add(tangentPoint);
graphingCalculator.add(errorVector);
graphingCalculator.add(constrainedPointFunction);
graphingCalculator.add(constrainedPointTangent);

// Make sure the error vector is always vertical
function updateDt(event: any): void {
  xPlusDt.value = event.point.x;
  dt = xPlusDt.value - tangentPoint.position.x;
}
errorVector.on('mousedrag', updateDt);
constrainedPointFunction.on('mousedrag', updateDt);
constrainedPointTangent.on('mousedrag', updateDt);

let mouseOver = false;
let mouseDown = false;

function updateCursorStyle(): void {
  if (mouseDown) {
    document.body.style.cursor = 'grabbing';
  } else if (mouseOver) {
    document.body.style.cursor = 'grab';
  } else {
    document.body.style.cursor = '';
  }
}
errorVector.on('mouseenter', (): void => {
  mouseOver = true;
  updateCursorStyle();
});
errorVector.on('mouseleave', (): void => {
  mouseOver = false;
  updateCursorStyle();
});
errorVector.on('mousedown', (): void => {
  mouseDown = true;
  updateCursorStyle();
});
graphingCalculator.on('mouseup', (): void => {
  mouseDown = false;
  updateCursorStyle();
});

// Create and add labels
const approixationLabel = new vima.TextGraphic({
  content: 'f(t)+Δtf\'(t)',
  fontFamily: 'Latin Modern Roman',
  position: constrainedPointTangent.positionVariable,
  fontWeight: 'bold',
  fontSize: 18
});
const exactLabel = new vima.TextGraphic({
  content: 'f(t+Δt)',
  fontFamily: 'Latin Modern Roman',
  position: constrainedPointFunction.positionVariable,
  fontWeight: 'bold',
  fontSize: 18
});
const fxLabel = new vima.TextGraphic({
  content: 'f(t)',
  fontFamily: 'Latin Modern Roman',
  position: tangentPoint.positionVariable,
  fontWeight: 'bold',
  offset: new vima.Vector2(0, 0.15),
  fontSize: 18
});
graphingCalculator.add(approixationLabel);
graphingCalculator.add(exactLabel);
graphingCalculator.add(fxLabel);

// Rotate labels when their positions change
function getTangentAngleAt(x: number): number {
  return Math.atan(Math.cos(x));
}
function getUnitCircleVectorAtAngle(angle: number): vima.Vector2 {
  return new vima.Vector2(Math.cos(angle), Math.sin(angle));
}
function rotateExactLabel(): void {
  const angle: number = getTangentAngleAt(
    constrainedPointFunction.positionVariable.value.x);
  exactLabel.rotation = angle * 180 / Math.PI;
  if (constrainedPointTangent.position.y >
    constrainedPointFunction.position.y) {
    exactLabel.offset =
      getUnitCircleVectorAtAngle(angle - Math.PI / 2).multiply(0.15);
  } else {
    exactLabel.offset =
      getUnitCircleVectorAtAngle(angle + Math.PI / 2).multiply(0.15);
  }
}
function rotateApproximationLabel(): void {
  const angle: number = Math.atan(Math.cos(tangentPointX.value));
  approixationLabel.rotation = angle * 180 / Math.PI;
  if (constrainedPointTangent.position.y >
    constrainedPointFunction.position.y) {
    approixationLabel.offset =
      getUnitCircleVectorAtAngle(angle + Math.PI / 2).multiply(0.15);
  } else {
    approixationLabel.offset =
      getUnitCircleVectorAtAngle(angle - Math.PI / 2).multiply(0.15);
  }
}
function rotateLabels(): void {
  rotateApproximationLabel();
  rotateExactLabel();
}
tangentPointX.register(rotateLabels);
constrainedPointTangent.positionVariable.register(rotateLabels);
rotateLabels();
