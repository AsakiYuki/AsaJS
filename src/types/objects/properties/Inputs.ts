import { Bool } from "../../values/Bool";

export interface Inputs {
    modal?: Bool;
    inline_modal?: Bool;
    always_listen_to_input?: Bool;
    always_handle_pointer?: Bool;
    always_handle_controller_direction?: Bool;
    hover_enabled?: Bool;
    prevent_touch_input?: Bool;
    consume_event?: Bool;
    consume_hover_events?: Bool;
    gesture_tracking_button?: Bool;
}
