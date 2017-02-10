// Row vector.
class Vector extends Matrix {
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
}
