/**
 * Interface that represents the ability (and desire) of a graphic object to be
 * notified when the bounds of the parent {@link GraphingCalculator} change.
 */
export interface IBoundsSubscriber {
  onBoundsUpdated(bounds: paper.Rectangle): void;
}
