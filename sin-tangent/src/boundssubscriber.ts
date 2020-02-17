export default interface BoundsSubscriber {
  onBoundsUpdated(bounds: paper.Rectangle): void;
}
