import * as paper from 'paper';


export default interface ScreenTransformSubscriber {
  onScreenTransformUpdated(matrix: paper.Matrix): void;
}
