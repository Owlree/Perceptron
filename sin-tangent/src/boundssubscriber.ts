/**
 * Interface that represents the ability (and desire) of a graphic object to be
 * notified when the bounds of the parent {@link GraphingCalculator} change.
 */
export default interface BoundsSubscriber {
  onBoundsUpdated(bounds: paper.Rectangle): void;
}
