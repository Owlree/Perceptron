class Line2D {
  constructor(point, direction) {

    this.m_Point     = point;
    this.m_Direction = direction;

    if (!this.isVertical()) {
      this.m_Direction.normalizeComponentMut(0);
      this.m_Point.translateMut(this.m_Direction.getMultipliedScalar(this.m_Point.getX()));
    }
  }

  isVertical() {
    return this.m_Direction.get(0) === 0.0;
  }

  getY(x) {
    if (this.isVertical()) {
      throw new Error('Cannot get y of vertical line.');
    } else {
      return this.m_Point.getTranslated(this.m_Direction.getMultipliedScalar(x)).getY();
    }
  }
}
