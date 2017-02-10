class ViewController {

  constructor() {

    // get MVC references
    this.m_View = new SvgView();
    this.m_GeometryModel = new GeometryModel();

    // set view event callbacks
    this.m_View.getSvgElement().on(   'click', () => this.__clicked());
    this.m_View.getButtonSquares().on('click', () => this.__squaresButtonPushed());
    this.m_View.getButtonCircles().on('click', () => this.__circlesButtonPushed());
    this.m_View.getButtonLearn().on(  'click', () => this.__learn());

    // set model event callbacks
    this.m_GeometryModel.setChangedCallback((action) => this.__modelChanged(action));

    // nothing is learned in the beginning
    this.m_Learned = false;

    // add default points
    this.m_GeometryModel.addPoint(0.28, 0.23, 0.0);
    this.m_GeometryModel.addPoint(0.47, 0.18, 0.0);
    this.m_GeometryModel.addPoint(0.66, 0.26, 0.0);
    this.m_GeometryModel.addPoint(0.17, 0.36, 0.0);
    this.m_GeometryModel.addPoint(0.22, 0.87, 1.0);
    this.m_GeometryModel.addPoint(0.33, 0.82, 1.0);
    this.m_GeometryModel.addPoint(0.49, 0.81, 1.0);
    this.m_GeometryModel.addPoint(0.64, 0.75, 1.0);
    this.__learn();
  }

  __modelChanged(action) {
    switch (action.name) {
      case 'addedPoint':
      {
        let x = action.point.getX() * this.m_View.getWidth();
        let y = this.m_View.getHeight() - action.point.getY() * this.m_View.getHeight();
        if (action.point.getValue() == 0.0) {
          this.m_View.addSquare(x, y);
        } else if (action.point.getValue() == 1.0) {
          this.m_View.addCircle(x, y);
        }
        break;
      }
      case 'reset':
      {
        this.m_View.clear();
        break;
      }
      default:
        break;
    }
  }

  __clicked() {

    if (this.m_Learned === true) {
      this.m_Learned = false;
      this.m_GeometryModel.reset();
    }

    let pos = this.m_View.getMousePosition();

    let geometryX = pos.x / this.m_View.getWidth();
    let geometryY = (this.m_View.getHeight() - pos.y) / this.m_View.getHeight();

    console.log([geometryX, geometryY]);

    if (this.m_View.getButtonSquares().classed('active')) {
      this.m_GeometryModel.addPoint(geometryX, geometryY, 0.0);
    } else if (this.m_View.getButtonCircles().classed('active')) {
      this.m_GeometryModel.addPoint(geometryX, geometryY, 1.0);
    }

    if (this.m_GeometryModel.getPointsCount(0.0) > 0 &&
        this.m_GeometryModel.getPointsCount(1.0) > 0) {
      this.m_View.getButtonLearn().attr('disabled', null);
    }
  }

  __squaresButtonPushed() {
    this.m_View.getButtonSquares().classed('active', true);
    this.m_View.getButtonCircles().classed('active', null);
  }

  __circlesButtonPushed() {
    this.m_View.getButtonSquares().classed('active', null);
    this.m_View.getButtonCircles().classed('active', true);
  }

  __clear() {
    this.m_GeometryModel.reset();
  }

  __learn() {
    this.m_View.getButtonLearn().attr('disabled', true);
    let dataPoints = [];
    for (let i in this.m_GeometryModel.getPoints()) {
      dataPoints.push({
        vector: [
          this.m_GeometryModel.getPoints()[i].getX(),
          this.m_GeometryModel.getPoints()[i].getY()
        ],
        expected: this.m_GeometryModel.getPoints()[i].getValue()
      });
    }

    let perceptron = new Perceptron();
    let weights = perceptron.feedTrainingSet(dataPoints, 2);

    if (weights == null) {
      this.m_View.showError();
    } else {
      let a = weights[1];
      let b = weights[2];
      let c = weights[0];

      let f = function(x) {
        return - (c + a * x) / b;
      }

      let begin = -0.1;
      let end   = +1.1;

      let x1 = begin * this.m_View.getWidth();
      let y1 = this.m_View.getHeight() - f(begin) * this.m_View.getHeight();
      let x2 = end   * this.m_View.getWidth();
      let y2 = this.m_View.getHeight() - f(end)   * this.m_View.getHeight();
      this.m_View.addLine(x1, y1, x2, y2);
      this.m_Learned = true;
    }
  }
};

let viewController = new ViewController();
