import { Value } from "../value.js"

export interface ScrollView {
	scrollbar_track_button?: Value<string>
	scrollbar_touch_button?: Value<string>
	scroll_speed?: Value<number>
	gesture_control_enabled?: Value<number>
	always_handle_scrolling?: Value<boolean>
	touch_mode?: Value<boolean>
	scrollbar_box?: Value<string>
	scrollbar_track?: Value<string>
	scroll_view_port?: Value<string>
	scroll_content?: Value<string>
	scroll_box_and_track_panel?: Value<string>
	jump_to_bottom_on_update?: Value<boolean>
	allow_scroll_even_when_content_fits?: Value<boolean>
	scrollbar_always_visible?: Value<boolean>
}
