import * as paper from 'paper';

// import Colors from './colors';
import FunctionGraphic from './functiongraphic';
import GraphingCalculator from './graphingcalculator';
import WritableVariable from './writeablevariable';
import Variable from './variable';
import Colors from './colors';

const graphingCalculator = new GraphingCalculator('canvas');
graphingCalculator.backgroundColor = Colors.backgroundColor;

// Create the main function
const curve: FunctionGraphic = new FunctionGraphic('sin(x)', {
  strokeColor: Colors.mainColor
});

// Create a tangent line at a variable point
const variable: WritableVariable<number> = new WritableVariable<number>(0);
const tangent: FunctionGraphic = new FunctionGraphic(
  'cos(p) * x + sin(p) - cos(p) * p', {
    variables: {p: <Variable<number>>variable},
    strokeColor: Colors.mainColor
  });

// Add both of them to the graphing calculator
graphingCalculator.add(curve);
graphingCalculator.add(tangent);

// let x = new WritableVariable<number>(0);
// let y = new WritableVariable<number>(0);
// let freePoint = new freePoint();
// let functionPoint = new FunctionPoint(curve, <Variable<number>>x);

// graphingCalculator.add(point);
// graphingCalculator.add(freePoint);

// Update the tanget point on mouse move
paper.view.on('mousemove', (event: paper.MouseEvent) => {
  variable.value = event.point!.x!;
});
