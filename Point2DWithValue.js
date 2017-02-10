class Point2DWithValue extends Point2D {
  constructor(x, y, value) {
    super(x, y);
    this.m_Value = value;
  }
  getValue() { return this.m_Value; }
}
