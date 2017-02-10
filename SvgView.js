class SvgView extends View {

  constructor() {

    super();

    this.m_SvgElement    = d3.select('#board');
    this.m_ButtonSquares = d3.select('#button-squares');
    this.m_ButtonCircles = d3.select('#button-circles');
    this.m_ButtonLearn   = d3.select('#button-learn');
    this.m_Error         = d3.select('#error');

    this.m_Options = {
      radius: 6.0,
      stroke: 1.0,
      colors: {
        square: "#880000",
        circle: "#008800",
        line  : "#000000"
      }
    };

  }

  // D3 objects getters
  getSvgElement()    { return this.m_SvgElement;    }
  getButtonSquares() { return this.m_ButtonSquares; }
  getButtonCircles() { return this.m_ButtonCircles; }
  getButtonLearn()   { return this.m_ButtonLearn;   }

  // dimension getters
  getHeight() { return parseFloat(this.m_SvgElement.style('height')); }
  getWidth()  { return parseFloat(this.m_SvgElement.style('width')); }

  // private helpers
  __stopPropagation(el) {
    el.on('click', function() {
      d3.event.stopPropagation();
    });
  }

  // methods
  addCircle(x, y) {
    let circle = this.m_SvgElement.append('circle');

    circle.attr ('cx', x)
          .attr ('cy', y)
          .attr ('r',  this.m_Options.radius)
          .style('fill', this.m_Options.colors.circle);

    this.__stopPropagation(circle);
  }

  addSquare(x, y) {
    let square = this.m_SvgElement.append('rect');

    square.attr ('x',      x - this.m_Options.radius)
          .attr ('y',      y - this.m_Options.radius)
          .attr ('width',  2 * this.m_Options.radius)
          .attr ('height', 2 * this.m_Options.radius)
          .style('fill',   this.m_Options.colors.square);

    this.__stopPropagation(square);
  }

  addPoint(type, x, y) {
    switch (type) {
      case 'circle':
        this.addCircle(x, y); break;
      case 'square':
        this.addSquare(x, y); break;
      default:
        break;
    }
  }

  addLine(x1, y1, x2, y2) {
    let line = this.m_SvgElement.append('line');
    line.attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke-width', this.m_Options.stroke)
        .attr("stroke",       this.m_Options.colors.line);
  }

  showError() {
    this.m_Error.attr('hidden', null);
  }

  // reset
  clear() {
    this.m_SvgElement.selectAll('*').remove();
    this.m_Error.attr('hidden', true);
  }
}
