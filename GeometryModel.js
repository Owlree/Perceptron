class GeometryModel {
  constructor() {
    this.m_Points = [];
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

  // callback setters
  setChangedCallback(callback) {
    this.m_CallbackCaller.setMethod(this.m_Options.callbackNames.changed, callback);
  }

  addPoint(x, y, value) {
    let point = new Point2DWithValue(x, y, value);
    this.m_Points.push(point);
    this.m_PointsCounter.increment(value);
    this.__onChange({
      name: 'addedPoint',
      point: point
    });
  }

  reset() {
    this.m_Points = [];
    this.m_PointsCounter = new Counter();
    this.__onChange({
      name: 'reset'
    });
  }

  __onChange(action) {
    this.m_CallbackCaller.call(this.m_Options.callbackNames.changed, [action]);
  }
};
