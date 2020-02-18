import FunctionGraphic from './functiongraphic';
import GraphingCalculator from './graphingcalculator';
import Colors from './colors';
import FreePointGraphic from './freepointgraphic';

const graphingCalculator = new GraphingCalculator('canvas');
graphingCalculator.backgroundColor = Colors.backgroundColor;

let freePoint = new FreePointGraphic();

// Create the main function
const curve: FunctionGraphic = new FunctionGraphic('sin(x)', {
  strokeColor: Colors.mainColor
});

// Create a tangent line at a variable point
const tangent: FunctionGraphic = new FunctionGraphic(
  'cos(p) * x + sin(p) - cos(p) * p', {
    variables: {p: freePoint.xVariable},
    strokeColor: Colors.mainColor
  });

// Add both of them to the graphing calculator
graphingCalculator.add(curve);
graphingCalculator.add(tangent);
graphingCalculator.add(freePoint);