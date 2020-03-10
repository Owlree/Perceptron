import * as vima from 'vima';

const bounds: vima.Rectangle = new vima.Rectangle(
  new vima.Vector2(-5, 5), new vima.Vector2(5, -5));

// Create an instance of the graphing calculator
const graphingCalculator = new vima.GraphingCalculator('canvas', bounds);

const slopeField = new vima.SlopeField('sin(x + y)', bounds);
graphingCalculator.add(slopeField);

const point = new vima.FreePointGraphic();
graphingCalculator.add(point);