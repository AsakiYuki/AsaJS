import { ButtonId } from "../../enums/ButtonId.js"
import { ButtonMapping, Value } from "../value.js"

export interface Input {
	button_mappings?: Array<ButtonMapping>
	modal?: Value<boolean>
	inline_modal?: Value<boolean>
	always_listen_to_input?: Value<boolean>
	always_handle_pointer?: Value<boolean>
	always_handle_controller_direction?: Value<boolean>
	hover_enabled?: Value<boolean>
	prevent_touch_input?: Value<boolean>
	consume_event?: Value<boolean>
	consume_hover_events?: Value<boolean>
	gesture_tracking_button?: Value<string | ButtonId>
	gamepad_deflection_mode?: Value<boolean>
}
