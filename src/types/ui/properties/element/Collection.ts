import { CollectionName } from "../../enums/CollectionName.js"
import { Value } from "../value.js"

export interface Collection {
	collection_name?: Value<string | CollectionName>
	collection_index?: Value<number>
	ignoreCollectionItem?: Value<boolean>
}
