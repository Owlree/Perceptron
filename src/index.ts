import * as paper from 'paper'

function GetPoints(f: (x: number) => number): Array<paper.Point> {
    let points: Array<paper.Point> = [];
    for (let i = -1000; i < +1000; ++i) {
        points.push(new paper.Point(i, f(i)));
    }
    return points;
}

function GetApproximateTangent(x: number, f: (x: number) => number): ((x: number) => number) {
    const delta = 0.1;
    const a = new paper.Point(x - delta, f(x - delta));
    const b = new paper.Point(x + delta, f(x + delta));
    
    const slope: number = (b.y - a.y) / (b.x - a.x);
    const intercept: number = a.y - slope * a.x;
    
    return (x: number) => slope * x + intercept;
}

window.onload = function(): void {
    paper.setup('myCanvas');
    
    const sinusoidal: (x:number) => number = 
        (x: number) => 100 * Math.sin(x / 100);

    const sinusoidalView: paper.Path = 
        new paper.Path(GetPoints(sinusoidal));
    sinusoidalView.strokeColor = '#33FFAA';
    
    let tangentView: paper.Path = 
        new paper.Path(
            GetPoints(
                GetApproximateTangent(0, sinusoidal)));
    tangentView.strokeColor = '#FFDDBB';

    paper.project.activeLayer.transform(
        new paper.Matrix(
            1,  0,
            0, -1,
            paper.view.center.x,
            paper.view.center.y));
}
