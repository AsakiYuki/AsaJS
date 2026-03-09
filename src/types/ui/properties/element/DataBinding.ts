import { BindingItem, Value } from "../value.js"

export interface DataBinding {
	bindings: Value<Array<BindingItem>>
}
