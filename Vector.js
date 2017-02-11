// Row vector.
class Vector extends Matrix {

  static pointToPoint(a, b) {
    // check input
    {
      let ERROR_WRONG_TYPE = 'Input must be two numbers.';

      if (!(a instanceof Point2D) || !(b instanceof Point2D)) {
        throw new Error(ERROR_WRONG_TYPE);
      }
    }
    return new Vector([b.getX() - a.getX(), b.getY() - a.getY()]);
  }

  constructor(data) {
    // check input
    {
      let ERROR_WRONG_TYPE = 'Input data must be an array of numbers.';

      if (Array.isArray(data) === false) {
        throw new Error(ERROR_WRONG_TYPE);
      }

      for (let i = 0; i < data.length; ++i) {
        if (typeof data[i] !== 'number') {
          throw new Error(ERROR_WRONG_TYPE);
        }
      }
    }
    super([data]);
  }
  get(i) {
    return super.get(0, i);
  }

  getLength() {
    let squared = 0;
    for (let i = 0; i < this.getColumnsCount(); ++i) {
      squared += Math.pow(this.get(i), 2);
    }
    return Math.sqrt(squared);
  }

  getNormalized() {
    let length = this.getLength();
    if (length === 0.0) {
      return 0.0;
    } else {
      return this.getMultipliedScalar(1 / this.getLength());
    }
  }

  getNormalizedComponent(i) {
    if (this.get(i) === 0) {
      throw new Error('Cannot normalize null component.');
    } else {
      return this.getMultipliedScalar(1 / this.get(i));
    }
  }

  normalizeComponentMut(i) {
    if (this.get(i) === 0) {
      throw new Error('Cannot normalize null component.');
    } else {
      this.multiplyScalarMut(1 / this.get(i));
    }
  }

  getMultipliedScalar(scalar) {
    let newData = [];
    for (let i = 0; i < this.getColumnsCount(); ++i) {
      newData.push(this.get(i) * scalar)
    }
    return new Vector(newData);
  }

  getSubtracted(vector) {
    return this.getAdded(vector.getMultipliedScalar(-1.0));
  }

  getAdded(vector) {
    let newData = [];
    for (let i = 0; i < this.getColumnsCount(); ++i) {
      newData.push(this.get(i) - vector.get(i));
    }
    return new Vector(newData);
  }

  addVectorMut(vector) {
    super.addMatrixMut(vector.getMatrix());
  }
}
