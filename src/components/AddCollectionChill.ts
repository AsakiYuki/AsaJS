import { UIChildNameCallback } from "../types/components/NameCallback";
import { Properties } from "../types/objects/properties/Properties";
import { UI } from "./UI";

/**
 * Callback function type for setting the name of a child element based on its index.
 *
 * @param {number} index - The index of the child element in the collection.
 * @returns {string} - The name of the child element.
 */
type setNameCallback = (index: number) => string;

/**
 * Adds child elements to a parent UI component based on the provided collection length and index range.
 * Each child element can optionally have additional properties and a dynamic name based on its index.
 *
 * @param {UI} parent - The parent UI component to which the child elements will be added.
 * @param {UI} child - The UI child component to be added to the parent.
 * @param {number} collectionLength - The total number of child elements to be added.
 * @param {number} [startIndex=0] - The starting index from which to begin adding child elements. Defaults to 0.
 * @param {Properties} [properties] - Optional properties to apply to each child element.
 * @param {setNameCallback} [setName] - Optional callback function to dynamically set the name of each child element based on its index.
 * @param {UIChildNameCallback} [callback] - Optional callback function to be invoked after adding each child element.
 *
 * @returns {void}
 *
 * @example
 * // Adds 5 child elements to the parent UI, starting from index 0.
 * AddCollectionChild(parentUI, childUI, 5, 0, { color: 'red' }, (index) => `child-${index}`);
 */
export function AddCollectionChild(
    parent: UI,
    child: UI,
    collectionLength: number,
    startIndex: number = 0,
    properties?: Properties,
    setName?: setNameCallback,
    callback?: UIChildNameCallback
) {
    for (let index = startIndex; index < collectionLength; index++) {
        const name = setName?.(index);
        parent.addChild(
            child,
            {
                ...properties,
                collection_index: index,
            },
            name,
            callback
        );
    }
}
