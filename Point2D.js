class Point2D {
  constructor(x, y) {
    this.m_Vector = new Vector([x, y]);
  }
  getX() { return this.m_Vector.get(0); }
  getY() { return this.m_Vector.get(1); }
  translateMut(vector) {
    if (vector.getColumnsCount() !== 2) {
      throw new Error('Vector must be of size 2.')
    } else {
      this.m_Vector.addVectorMut(vector);
    }

  }
  getTranslated(vector) {
    if (vector.getColumnsCount() !== 2) {
      throw new Error('Vector must be of size 2.')
    } else {
      let newVector = this.m_Vector.getAdded(vector);
      return new Point2D(newVector.get(0), newVector.get(1));
    }
  }
};
