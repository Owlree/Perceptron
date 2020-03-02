/**
 * Interface that represents the ability (and desire) of a graphic object to be
 * notified when the transform that is applied to the screen to obtain the
 * local coordinate system changes in the parent {@link GraphingCalculator}.
 */
export default interface IScreenTransformSubscriber {
  onScreenTransformUpdated(matrix: paper.Matrix): void;
}
