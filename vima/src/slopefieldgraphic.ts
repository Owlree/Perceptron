// import * as math from 'mathjs';
import * as paper from 'paper';
import * as math from 'mathjs';

import * as Colors from './colors';
import { Graphic } from "./graphic";
import { Rectangle } from './rectangle';
import { Variable } from './variable';
import { DecoratorWatchVariable } from './decoratorwatchvariable';
import { Vector2 } from './vector2';


/**
 * A graphic that represents a slope field
 */
export class SlopeField extends Graphic {

  private readonly _slopeFunction: math.EvalFunction;
  private readonly _group: paper.Group;
  private readonly _solution: paper.Path;
  private readonly _slopeField: paper.Group;

  constructor(slopeFunctionStr: string, bounds: Rectangle) {
    super();

    this._slopeFunction = math.parse(slopeFunctionStr).compile();
    this._item = this._group = new paper.Group();

    const hstep = Math.abs(bounds.left - bounds.right) / 25;
    const vstep = Math.abs(bounds.bottom - bounds.top) / 15;

    this._slopeField = new paper.Group();

    for (let i = bounds.left; i <= bounds.right; i += hstep) {
      for (let j = bounds.bottom; j <= bounds.top; j += vstep) {
        const line = new paper.Path.Line(
          new paper.Point(i - 0.1, j),
          new paper.Point(i + 0.1, j)
        );
        line.rotate(180 / Math.PI * Math.atan2(this._slopeFunction.evaluate({x: i, y: j}), 1));
        this._slopeField.addChild(line);
      }
    }

    this._slopeField.opacity = 0.5;
    this._slopeField.strokeWidth = 0.005;
    this._group.addChild(this._slopeField);
    this.color = Colors.mainColor;

    this._solution = new paper.Path();
    this._solution.strokeWidth = 0.02;
    this._group.addChild(this._solution);
    this.solutionColor = Colors.redColor;
  }

  @DecoratorWatchVariable
  set solutionPosition(position_: Vector2 | Variable<Vector2>) {
    const position = position_ as Vector2;

    const segments = [new paper.Segment(position.array)];
    let current = new paper.Point(position.array);
    let prevAngle: number | undefined = undefined;
    for (let i = 0; i < 100; ++i) {
      let angle = Math.atan2(this._slopeFunction.evaluate({
        x: current.x,
        y: current.y
      }), 1);

      if (prevAngle !== undefined) {
        if (angle < prevAngle) {
          while (Math.abs(angle + Math.PI - prevAngle) < Math.abs(angle - prevAngle)) {
            angle += Math.PI;
          }
        } else if (angle > prevAngle) {
          while (Math.abs(angle - Math.PI - prevAngle) < Math.abs(angle - prevAngle)) {
            angle -= Math.PI;
          }
        }
      }

      const vector = new Vector2(
        Math.cos(angle) * 0.2,
        Math.sin(angle) * 0.2
      );

      prevAngle = angle;
      current = new paper.Point(current.x + vector.x, current.y + vector.y);
      segments.push(new paper.Segment(current));

      this._solution.removeSegments();
      this._solution.addSegments(segments);
    }
  }

  @DecoratorWatchVariable
  set color(color: paper.Color | Variable<paper.Color>) {
    this._slopeField.strokeColor = color as paper.Color;
  }

  @DecoratorWatchVariable
  set solutionColor(color: paper.Color | Variable<paper.Color>) {
    this._solution.strokeColor = color as paper.Color;
  }
}
