class Matrix {

  static zeros(n, m) {

  }

  constructor(data) {

    // check input
    {
      let ERROR_WRONG_TYPE = 'Input data must be an array of arrays of numbers.';
      let ERROR_WRONG_SIZE = 'All rows must have the same size.';
      let ERROR_EMPTY      = 'Can\' be empty;';

      if (Array.isArray(data) === false) {
        throw new Error(ERROR_WRONG_TYPE);
      }

      for (let i = 0; i < data.length; ++i) {
        if (Array.isArray(data[i]) === false) {
          throw new Error(ERROR_WRONG_TYPE);
        }

        for (let j = 0; j < data[i].length; ++j) {
          if (typeof data[i][j] !== 'number') {
            throw new Error(ERROR_WRONG_TYPE);
          }
        }
      }

      if (data.length === 0) {
        throw new Error(ERROR_EMPTY);
      }

      let sz = data[0].length;

      for (let i = 1; i < data.length; ++i) {
        if (sz !== data[i].length) {
          throw new Error(ERROR_WRONG_SIZE);
        }
      }

      if (sz === 0) {
        throw new Error(ERROR_EMPTY);
      }
    }

    this.m_Data         = data;
    this.m_ColumnsCount = this.m_Data[0].length;
    this.m_RowsCount    = this.m_Data.length;

  }

  // dimmentions getters
  getRowsCount()    { return this.m_RowsCount;    }
  getColumnsCount() { return this.m_ColumnsCount; }

  get(i, j) {

    // check input
    {
      if ((typeof i !== 'number') || (typeof j !== 'number')) {
        throw new Error('Matrices indices must be numbers.');
      }

      if (isNaN(i) || isNaN(j)) {
        throw new Error('Indices cannot be NaN.');
      }

      if (i !== parseInt(i) || j !== parseInt(j)) {
        throw new Error('Indices must be integers.');
      }

      if (!(0 <= i && i < this.getRowsCount()) ||
          !(0 <= j && j < this.getColumnsCount())) {
        let message = `i: ${i}, j: ${j}`;
        throw new Error(`Indices out of bounds (${message}).`);
      }
    }
    return this.m_Data[i][j];
  }

  multiply(B) {

    // check input
    {
      if (!(B instanceof Matrix)) {
        throw new Error('Argument must be a matrix.');
      }

      if (this.getColumnsCount() !== B.getRowsCount()) {
        throw new Error('Matrices have wrong dimensions.');
      }
    }

    let A = this;
    let newData = [];
    let size = A.getColumnsCount();

    for (let i = 0; i < A.getRowsCount(); ++i) {

      let newRow = [];
      for (let j = 0; j < B.getColumnsCount(); ++j) {

        let res = 0;
        for (let k = 0; k < size; ++k) {
          res += A.get(i, k) * B.get(k, j);
        }
        newRow.push(res);
      }
      newData.push(newRow);
    }
    return new Matrix(newData);
  }

  addMatrixMut(matrix) {
    for (let i = 0; i < this.getRowsCount(); ++i) {
      for (let j = 0; j < this.getColumnsCount(); ++j) {
        this.m_Data[i][j] += matrix.get(i, j);
      }
    }
  }

  multiplyScalarMut(scalar) {
    for (let i = 0; i < this.getRowsCount(); ++i) {
      for (let j = 0; j < this.getColumnsCount(); ++j) {
        this.m_Data[i][j] *= scalar;
      }
    }
  }

  getMatrix() {
    return this;
  }
}
