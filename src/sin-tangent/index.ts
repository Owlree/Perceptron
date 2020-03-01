import ConstrainedPointFunctionGraphic from './constrainedpointfunctiongraphic';
import FreePointGraphic from './freepointgraphic';
import FunctionGraphic from './functiongraphic';
import GraphingCalculator from './graphingcalculator';
import PointGraphicType from './pointgraphictype';
import Variable from './variable';
import Vector2 from './vector2';
import VectorGraphic from './vectorgraphic';
import WritableVariable from './writeablevariable';

const graphingCalculator = new GraphingCalculator('canvas');

// Create the main function
const functionGraphic: FunctionGraphic = new FunctionGraphic('sin(x)');

// Create a point that is constrained to stay on the main function graphic
const constrainedPoint = new ConstrainedPointFunctionGraphic(functionGraphic);

const xVariable = new WritableVariable<number>(constrainedPoint.position.x);
constrainedPoint.positionVariable.register((variable: Variable<Vector2>): void => {
  xVariable.value = variable.value.x;
});

// Create a tangent line at a variable point
const tangent: FunctionGraphic = new FunctionGraphic(
  'cos(p) * x + sin(p) - cos(p) * p', {
    variables: {
      p: xVariable
    }
  });

const constrainedPoint1 = new ConstrainedPointFunctionGraphic(functionGraphic, { x: 0.25 });
const constrainedPoint2 = new ConstrainedPointFunctionGraphic(tangent, { x: 0.25 });


// Add both of them to the graphing calculator
graphingCalculator.add(functionGraphic);
graphingCalculator.add(tangent);
graphingCalculator.add(constrainedPoint);
graphingCalculator.add(constrainedPoint1);
graphingCalculator.add(constrainedPoint2);
graphingCalculator.add(new VectorGraphic(constrainedPoint1, constrainedPoint2));

// Add a vector graphic from (0, 0) with a single controller
let a = new FreePointGraphic({
  x: 0.25, y: -0.25,
  type: PointGraphicType.Circle,
  radius: 8
});
let b = new FreePointGraphic({
  x: 0.50, y: -0.50,
  type: PointGraphicType.Triangle,
  radius: 12
});
graphingCalculator.add(new VectorGraphic(a, b));
graphingCalculator.add(a);
graphingCalculator.add(b);
