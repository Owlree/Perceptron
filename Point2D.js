class Point2D {
  constructor(x, y) {
    this.m_Vector = new Vector([x, y]);
  }
  getX() { return this.m_Vector.get(0); }
  getY() { return this.m_Vector.get(1); }
};
