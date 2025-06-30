import { UIChildNameCallback } from "../types/components/NameCallback";
import { Properties } from "../types/objects/properties/Properties";
import { UI } from "./UI";

type setNameCallback = (index: number) => string;

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
