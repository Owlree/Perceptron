import FreePointGraphic from './freepointgraphic';
import FunctionGraphic from './functiongraphic';
import GraphingCalculator from './graphingcalculator';

const graphingCalculator = new GraphingCalculator('canvas');

let freePoint = new FreePointGraphic();

// Create the main function
const curve: FunctionGraphic = new FunctionGraphic('sin(x)');

// Create a tangent line at a variable point
const tangent: FunctionGraphic = new FunctionGraphic(
  'cos(p) * x + sin(p) - cos(p) * p', {
    variables: {
      p: freePoint.xVariable
    }
  });

// Add both of them to the graphing calculator
graphingCalculator.add(curve);
graphingCalculator.add(tangent);
graphingCalculator.add(freePoint);
