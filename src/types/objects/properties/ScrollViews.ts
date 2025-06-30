import { Bool } from "../../values/Bool";
import { Float } from "../../values/Number";
import { Str } from "../../values/Str";

export interface ScrollViews {
    scrollbar_track_button?: Str;
    scrollbar_touch_button?: Str;
    scroll_speed?: Float;
    gesture_control_enabled?: Bool;
    always_handle_scrolling?: Bool;
    touch_mode?: Bool;
    scrollbar_box?: Str;
    scrollbar_track?: Str;
    scroll_view_port?: Str;
    scroll_content?: Str;
    scroll_box_and_track_panel?: Str;
    jump_to_bottom_on_update?: Bool;
}
