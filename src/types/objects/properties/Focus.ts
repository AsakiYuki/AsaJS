import { FocusContainerCustom } from "./FocusContainerCustom";
import { FocusNavigationMode } from "../../enums/FocusNavigationMode";
import { Bool } from "../../values/Bool";
import { Int } from "../../values/Number";
import { Var } from "../../values/Variable";
import { Str } from "../../values/Str";

export interface Focus {
    default_focus_precedence?: Int;
    focus_enabled?: Bool;
    focus_wrap_enabled?: Bool;
    focus_magnet_enabled?: Bool;
    focus_identifier?: Str;
    focus_change_down?: Str;
    focus_change_up?: Str;
    focus_change_left?: Str;
    focus_change_right?: Str;
    focus_mapping?: Var | Array<any>;
    focus_container?: Bool;
    use_last_focus?: Bool;
    focus_navigation_mode_left?: Var | FocusNavigationMode;
    focus_navigation_mode_right?: Var | FocusNavigationMode;
    focus_navigation_mode_down?: Var | FocusNavigationMode;
    focus_navigation_mode_up?: Var | FocusNavigationMode;
    focus_container_custom_left?: FocusContainerCustom[];
    focus_container_custom_right?: FocusContainerCustom[];
    focus_container_custom_down?: FocusContainerCustom[];
    focus_container_custom_up?: FocusContainerCustom[];
}
