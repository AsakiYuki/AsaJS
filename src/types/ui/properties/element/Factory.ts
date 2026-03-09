import { Value, Variable } from "../value.js"

export type FactoryControlIds = Record<string, Value<string>>

export interface FactoryProperty {
	name?: Value<string>
	control_name?: Value<string>
	control_ids?: Value<FactoryControlIds>
	factory_variables?: Value<Array<Variable>>
	max_children_size?: Value<number>
	insert_location?: Value<"front">
	max_size?: Value<number>
}

export interface Factory {
	factory?: FactoryProperty
	control_ids?: Value<FactoryControlIds>
	control_name?: Value<string>
	factory_variables?: Value<Array<Variable>>
}
