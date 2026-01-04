import * as anim from "../../components/Animation.js"
import { BindingType } from "../enums/BindingType.js"
import * as bind from "../enums/Binding.js"
import { CollectionName } from "../enums/CollectionName.js"
import { BindingCondition } from "../enums/BindingCondition.js"
import { ButtonId } from "../enums/ButtonId.js"
import { MappingType } from "../enums/MappingType.js"
import { InputModeCondition } from "../enums/InputModeCondition.js"
import { Scope } from "../enums/Scope.js"

export type Variable = `$${string}`
export type Binding = `#${string}`
export type Animation = anim.Animation | `@${string}`

export type Array2<T> = [T, T]
export type Array3<T> = [T, T, T]
export type Array4<T> = [T, T, T, T]

export type Value<T> = Variable | T
export type AnimValue<T> = Value<T | Animation>

export type BindingItem = {
	ignored?: Value<boolean>
	binding_type?: Value<BindingType>
	binding_name?: Value<string | Binding | bind.Binding>
	binding_name_override?: Value<Binding | bind.Binding>
	binding_collection_name?: Value<string | CollectionName>
	binding_collection_prefix?: Value<string | CollectionName>
	binding_condition?: Value<string | BindingCondition>
	source_control_name?: Value<string>
	source_property_name?: Value<string | Binding | bind.Binding>
	target_property_name?: Value<Binding | bind.Binding>
	resolve_sibling_scope?: Value<boolean>
}

export type FocusContainerCustom = Array<{
	other_focus_container_name?: Value<string>
	focus_id_inside?: Value<string>
}>

export type ButtonMapping = {
	from_button_id?: Value<string | ButtonId>
	to_button_id?: Value<string | ButtonId>
	button_up_right_of_first_refusal?: Value<boolean>
	mapping_type?: Value<string | MappingType>
	ignored?: Value<boolean>
	input_mode_condition?: Value<string | InputModeCondition>
	ignore_input_scope?: Value<boolean>
	scope?: Value<string | Scope>
	consume_event?: Value<boolean>
	handle_select?: Value<boolean>
	handle_deselect?: Value<boolean>
}

export type PropertyBags = {
	[key: Binding]: Value<any>
}
