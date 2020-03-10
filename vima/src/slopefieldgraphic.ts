// import * as math from 'mathjs';
import * as paper from 'paper';
import * as math from 'mathjs';

import * as Colors from './colors';
import { Graphic } from "./graphic";
import { Rectangle } from './rectangle';
import { Variable } from './variable';
import { DecoratorWatchVariable } from './decoratorwatchvariable';


/**
 * A graphic that represents a slope field
 */
export class SlopeField extends Graphic {

  private readonly _slopeFunction: math.EvalFunction;
  private readonly _group: paper.Group;

  constructor(slopeFunctionStr: string, bounds: Rectangle) {
    super();

    this._slopeFunction = math.parse(slopeFunctionStr).compile();
    this._item = this._group = new paper.Group();

    const hstep = Math.abs(bounds.left - bounds.right) / 25;
    const vstep = Math.abs(bounds.bottom - bounds.top) / 15;

    for (let i = bounds.left; i <= bounds.right; i += hstep) {
      for (let j = bounds.bottom; j <= bounds.top; j += vstep) {
        const line = new paper.Path.Line(
          new paper.Point(i - 0.1, j),
          new paper.Point(i + 0.1, j)
        );
        line.rotate(180 / Math.PI * Math.atan2(this._slopeFunction.evaluate({x: i, y: j}), 1));
        this._group.addChild(line);
      }
    }

    // let current = new paper.Point(0.5, 0.5);
    // const segments = [new paper.Segment(current)];
    // let prevAngle: number | undefined = undefined;
    // for (let i = 0; i < 500; ++i) {
    //   segments.push(new paper.Segment(current));
    //   const line = new paper.Path.Line(
    //     new paper.Point(current.x, current.y),
    //     new paper.Point(current.x + 0.05, current.y)
    //   );
    //   let angle = Math.atan2(this._slopeFunction.evaluate({x: current.x, y: current.y}), 1);

    //   if (prevAngle !== undefined) {
    //     if (angle < prevAngle) {
    //       while (Math.abs(angle + Math.PI - prevAngle) < Math.abs(angle - prevAngle)) {
    //         angle += Math.PI;
    //       }
    //     } else if (angle > prevAngle) {
    //       while (Math.abs(angle - Math.PI - prevAngle) < Math.abs(angle - prevAngle)) {
    //         angle -= Math.PI;
    //       }
    //     }
    //   }

    //   line.rotate(180 / Math.PI * angle);
    //   const vec = new Vector2(
    //     Math.cos(angle) * 0.1,
    //     Math.sin(angle) * 0.1
    //   );
    //   prevAngle = angle;
    //   current = new paper.Point(current.x + vec.x, current.y + vec.y);
    //   this._group.addChild(line);
    // }

    // const line = new paper.Path.Line(
    //   new paper.Point(bounds.left, 0),
    //   new paper.Point(bounds.right, 0)
    // );
    // this._group.addChild(line);

    this._group.strokeWidth = 0.005;
    this.color = Colors.mainColor;
  }

  @DecoratorWatchVariable
  set color(color: paper.Color | Variable<paper.Color>) {
    this._group.strokeColor = (color as paper.Color);
    this._group.opacity = 0.5;
  }
}
