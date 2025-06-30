import { Bool } from "../../values/Bool";
import { Int } from "../../values/Number";
import { Str } from "../../values/Str";
export interface Toggles {
    radio_toggle_group?: Bool;
    toggle_name?: Str;
    toggle_default_state?: Bool;
    toggle_group_forced_index?: Int;
    toggle_group_default_selected?: Int;
    reset_on_focus_lost?: Bool;
    toggle_on_hover?: Str;
    toggle_on_button?: Str;
    toggle_off_button?: Str;
    enable_directional_toggling?: Bool;
    toggle_grid_collection_name?: Str;
    unchecked_control?: Str;
    checked_control?: Str;
    unchecked_hover_control?: Str;
    checked_hover_control?: Str;
    unchecked_locked_control?: Str;
    checked_locked_control?: Str;
    unchecked_locked_hover_control?: Str;
    checked_locked_hover_control?: Str;
}
