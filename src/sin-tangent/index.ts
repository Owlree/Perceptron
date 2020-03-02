import * as Colors from './colors';
import ConstrainedPointFunctionGraphic from './constrainedpointfunctiongraphic';
import FunctionGraphic from './functiongraphic';
import GraphingCalculator from './graphingcalculator';
import Variable from './variable';
import Vector2 from './vector2';
import VectorGraphic from './vectorgraphic';
import WritableVariable from './writeablevariable';

const graphingCalculator = new GraphingCalculator('canvas');

// Create the main function
const functionGraphic: FunctionGraphic = new FunctionGraphic('sin(x)', { strokeWidth: 0.015 });

// Create a point that is constrained to stay on the main function graphic
const constrainedPoint = new ConstrainedPointFunctionGraphic(functionGraphic, {
  radius: 5
});

const xVariable = new WritableVariable<number>(constrainedPoint.position.x);
constrainedPoint.positionVariable.register((variable: Variable<Vector2>): void => {
  xVariable.value = variable.value.x;
});

// Create a tangent line at a variable point
const tangent: FunctionGraphic = new FunctionGraphic(
  'cos(p) * x + sin(p) - cos(p) * p', {
    variables: {
      p: xVariable
    },
    strokeColor: Colors.blueColor,
    strokeWidth: 0.015
  });

let xvar = new WritableVariable<number>(0.5);

const constrainedPoint1 = new ConstrainedPointFunctionGraphic(functionGraphic, {
  x: xvar,
  interactive: false,
  radius: 5,
  color: Colors.redColor
});
const constrainedPoint2 = new ConstrainedPointFunctionGraphic(tangent, {
  x: xvar,
  interactive: false,
  radius: 5,
  color: Colors.redColor
});

constrainedPoint.positionVariable.register((variable: Variable<Vector2>): void => {
  xvar.value = variable.value.x + 1;
});

// Add both of them to the graphing calculator
graphingCalculator.add(functionGraphic);
graphingCalculator.add(tangent);
graphingCalculator.add(constrainedPoint);
graphingCalculator.add(new VectorGraphic(constrainedPoint1, constrainedPoint2, {
  color: Colors.redColor,
  strokeWidth: 0.03
}));
graphingCalculator.add(constrainedPoint1);
graphingCalculator.add(constrainedPoint2);
