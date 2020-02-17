import * as paper from 'paper';

import FunctionGraphic from './functiongraphic';
import GraphingCalculator from './graphingcalculator';
import Variable from './variable';

const graphingCalculator = new GraphingCalculator('canvas');

// Create the main function
const curve: FunctionGraphic = new FunctionGraphic('sin(x)');

// Create a tangent line at a variable point
const variable: Variable<number> = new Variable<number>(0);
const tangent: FunctionGraphic = new FunctionGraphic(
  'cos(p) * x + sin(p) - cos(p) * p',
  {variables: {p: variable}});

// Add both of them to the graphing calculator
graphingCalculator.add(curve);
graphingCalculator.add(tangent);

// Update the tanget point on mouse move
paper.view.on('mousemove', (event: paper.MouseEvent) => {
  variable.value = event.point.x;
});
