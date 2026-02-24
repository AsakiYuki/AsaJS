import { AnimValue, Array2, Binding, PropertyBags, Value, Variable } from "../value.js"

export interface Control {
	visible?: Value<boolean>
	ignored?: Value<boolean>
	enabled?: Value<boolean>
	layer?: Value<number>
	alpha?: AnimValue<number>
	propagate_alpha?: Value<boolean>
	clips_children?: Value<boolean>
	allow_clipping?: Value<boolean>
	clip_offset?: Value<Array2<number>>
	clip_state_change_event?: Value<string>
	enable_scissor_test?: Value<boolean>
	selected?: Value<boolean>
	use_child_anchors?: Value<boolean>
	contained?: Value<boolean>
	draggable?: Value<boolean>
	follows_cursor?: Value<boolean>
	property_bag?: Value<PropertyBags>
	collection_index?: Value<number>
	property_bag_for_children?: Value<PropertyBags>
	disable_anim_fast_forward?: Value<boolean>
	animation_reset_name?: Value<string>
	grid_position?: Value<Array2<number>>
	[key: Binding]: Value<any>
	[key: Variable]: Value<any>
}
