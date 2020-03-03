/**
 * Base abstract class that represents a drawable mathematical object.
 */
export declare abstract class Graphic {
    protected _path: paper.Path;
    protected _group: paper.Group;
    constructor();
    /**
     * Removes the underlying graphic from its parent.
     */
    remove(): void;
    /**
     * Adds the underlying paper.js path to a paper.js project or item.
     * @param owner The paper.js project or item to add the underlying path to
     */
    addTo(owner: paper.Project | paper.Layer | paper.Group | paper.CompoundPath): void;
}
//# sourceMappingURL=graphic.d.ts.map