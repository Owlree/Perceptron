import * as paper from 'paper'

window.onload = function() {
    paper.setup('myCanvas');

    const path = new paper.Path();

    path.strokeColor = '#3fe3ef';

    const square = paper.Shape.Rectangle(
        new paper.Point(-100, -100), 
        new paper.Point(100, 100));
        
    square.strokeColor = '#3fe3ef';
    
    paper.view.onFrame = function(event: paper.IFrameEvent): void {
        square.rotate(event.delta * 10);
    }
    
    paper.project.activeLayer.transform(
        new paper.Matrix(1,0,0,-1,paper.view.center.x, paper.view.center.y));
}
