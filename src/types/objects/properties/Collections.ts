import { Collection } from "../../enums/Collection";
import { Var } from "../../values/Variable";

export interface Collections {
    collection?: Var | string | Collection;
    collection_name?: Var | string | Collection;
}
