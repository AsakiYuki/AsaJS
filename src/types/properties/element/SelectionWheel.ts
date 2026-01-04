import { Value } from "../value.js"

export interface SelectionWheel {
	inner_radius?: Value<number>
	outer_radius?: Value<number>
	state_controls?: Value<Array<string>>
	slice_count?: Value<number>
	button_name?: Value<string>
	iterate_left_button_name?: Value<string>
	iterate_right_button_name?: Value<string>
	initial_button_slice?: Value<number>
	select_button_name?: Value<string>
	hover_button_name?: Value<string>
	analog_button_name?: Value<string>
}
