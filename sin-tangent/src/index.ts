import FunctionGraphic from './functiongraphic';
import GraphingCalculator from './graphingcalculator';
import ConstrainedPointFunctionGraphic from './constrainedpointfunctiongraphic';

const graphingCalculator = new GraphingCalculator('canvas');

// Create the main function
const functionGraphic: FunctionGraphic = new FunctionGraphic('sin(x)');

// Create a point that is constrained to stay on the main function graphic
const constrainedPoint = new ConstrainedPointFunctionGraphic(functionGraphic);

// Create a tangent line at a variable point
const tangent: FunctionGraphic = new FunctionGraphic(
  'cos(p) * x + sin(p) - cos(p) * p', {
    variables: {
      p: constrainedPoint.xVariable
    }
  });

// Add both of them to the graphing calculator
graphingCalculator.add(functionGraphic);
graphingCalculator.add(tangent);
graphingCalculator.add(constrainedPoint);