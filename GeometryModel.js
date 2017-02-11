class GeometryModel {
  constructor() {
    this.m_Points = [];
    this.m_Lines  = [];
    this.m_PointsCounter  = new Counter();
    this.m_CallbackCaller = new Caller();

    this.m_Options = {
      callbackNames: {
        changed: 'changed'
      }
    };
  }

  // getters
  getPoints()          { return this.m_Points;                  }
  getPointsCount(type) { return this.m_PointsCounter.get(type); }
  getLines()           { return this.m_Lines;                   }

  // callback setters
  setChangedCallback(callback) {
    this.m_CallbackCaller.setMethod(this.m_Options.callbackNames.changed, callback);
  }

  addPointWithValue(x, y, value) {
    let point = new Point2DWithValue(x, y, value);
    this.m_Points.push(point);
    this.m_PointsCounter.increment(value);
    this.__onChange({
      name: 'addedPoint',
      point: point
    });
  }

  addLine(slope, yIntercept) {
    let point1 = new Point2D(0, yIntercept);
    let point2 = new Point2D(1, slope + yIntercept);
    let line   = new Line2D(point1, Vector.pointToPoint(point1, point2));
    this.m_Lines.push(line);
    this.__onChange({
      name: 'addedLine',
      line: line
    });
  }

  reset() {
    this.m_Points = [];
    this.m_PointsCounter = new Counter();
    this.m_Lines = [];
    this.__onChange({
      name: 'reset'
    });
  }

  __onChange(action) {
    this.m_CallbackCaller.call(this.m_Options.callbackNames.changed, [action]);
  }
};
