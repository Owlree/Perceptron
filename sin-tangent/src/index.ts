import * as paper from 'paper';
import { Colors } from './colors';
import { GetPoints, GetApproximateTangent } from './numerical';

const render = () => {

  paper.setup('tangent');

  // Construct sinusoidal
  {
    const path = new paper.Path();
    path.strokeColor = Colors.Frangipan;
    path.strokeWidth = 1e-2;

    const setup = () => {
      const size = Math.min(
        paper.view.viewSize.width, paper.view.viewSize.height);
      paper.view.transform(paper.view.matrix.inverted());
      paper.view.transform(new paper.Matrix(
        size / (2 * Math.PI), 0,
        0, -size / (2 * Math.PI),
        paper.view.viewSize.width / 2, paper.view.viewSize.height / 2));

      path.removeSegments();
      path.add(
        ...GetPoints(
          Math.sin, paper.view.bounds.left, paper.view.bounds.right));
    }

    window.addEventListener('resize', setup);
    setup();
  }

  // Construct tangent
  {
    const path = new paper.Path(
      GetPoints(
        GetApproximateTangent(Math.sin, 0, 1),
        paper.view.bounds.left, paper.view.bounds.right));
    path.strokeColor = Colors.SpringGreen;
    path.strokeWidth = 1e-2;

    const handle = (e: paper.MouseEvent) => {

      // Update tangent
      path.removeSegments();
      path.add(
        ...GetPoints(
          GetApproximateTangent(Math.sin, e.point.x, 1e-2),
          paper.view.bounds.left, paper.view.bounds.right));
    };

    paper.view.on('mousedrag', handle);
    paper.view.on('mousedown', handle);
  }

  // Construct indicator line
  {
    const path = new paper.Path();
    path.strokeColor = Colors.Black;
    path.strokeWidth = paper.view.bounds.height / 1000;
    path.dashArray = [0.05, 0.02];

    const handle = (e: paper.MouseEvent) => {

      path.removeSegments();
      path.add(new paper.Point(e.point.x, paper.view.bounds.top));
      path.add(new paper.Point(e.point.x, paper.view.bounds.bottom));
    }

    paper.view.on('mousedrag', handle);
    paper.view.on('mousedown', handle);
    paper.view.on('mouseup', () => {path.removeSegments()});
  }

  // Construct tangent point
  {
    const path = new paper.Path.Circle(paper.view.center, 0.03);
    path.fillColor = Colors.SpringGreen;
    path.visible = false;

    const handle = (e: paper.MouseEvent) => {
      path.position = new paper.Point(e.point.x, Math.sin(e.point.x));
      path.visible = true;
    }

    paper.view.on('mousedrag', handle);
    paper.view.on('mousedown', handle);
    paper.view.on('mouseup', () => {path.visible = false});
  }
};

window.addEventListener('load', render);