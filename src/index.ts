import * as paper from 'paper'

window.onload = function(): void {
    paper.setup('myCanvas');

    const square = paper.Shape.Rectangle(
        new paper.Point(-100, -100), 
        new paper.Point(+100, +100));
        
    square.strokeColor = '#3FE3EF';
    
    paper.view.onFrame = 
        function(event: paper.IFrameEvent): void {
        square.rotate(event.delta * 10);
    }
    
    paper.project.activeLayer.transform(
        new paper.Matrix(
            1,  0, 
            0, -1,
            paper.view.center.x, 
            paper.view.center.y));
}
