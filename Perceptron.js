class Perceptron {

  constructor(size) {
    this.m_Weights   = [];
    for (let i = 0; i < size + 1; ++i) {
      this.m_Weights.push(0.0);
    }
  }

  f(z) {
    if (z == 0.0) return 1.0;
    return (z / Math.abs(z) + 1.0) / 2.0;
  }

  scalarProduct(v, w) {
    let res = 0;
    for (let i in v) {
      res += v[i] * w[i];
    }
    return res;
  }


  feedTrainingSet(D, size) {

    let x = [];
    let d = [];
    let w = [];

    for (let i = 0; i < size + 1; ++i) {
      w.push(0);
    }

    for (let i = 0; i < D.length; ++i) {
      x.push([1].concat(D[i].vector));
      d.push(D[i].expected);
    }

    let started = Date.now();
    let timeLimit = 1000;

    let shouldContinue = true;
    while (shouldContinue) {

      shouldContinue = false;
      for (let j in D) {

        let y = this.f(this.scalarProduct(x[j], w));

        let diff = d[j] - y;

        if (diff != 0) {
          shouldContinue = true;
        }

        for (let i in w) {
          w[i] += diff * x[j][i];
        }
      }

      if (Date.now() - started > 1000) {
        break;
      }

    }

    if (shouldContinue) return null;
    else                return w;
  }
}
