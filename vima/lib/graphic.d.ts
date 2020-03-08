import { MixinVariableListener } from './mixinvariablelistener';
import { IVariableListener } from './ivariablelistener';
/**
 * Base abstract class that represents a drawable mathematical object.
 */
declare abstract class Graphic implements IVariableListener {
    protected _item: paper.Item;
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
    on(event: string, callback: Function): void;
}
interface Graphic extends MixinVariableListener {
}
export { Graphic };
//# sourceMappingURL=graphic.d.ts.map