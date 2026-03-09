import { FocusNavigationMode } from "../../enums/FocusNavigationMode.js"
import { FocusContainerCustom, Value } from "../value.js"

export interface FocusMapping {
	focus_identifier?: string
	focus_change_right?: string
	focus_change_left?: string
	focus_change_up?: string
	focus_change_down?: string
}

export interface Focus {
	default_focus_precedence?: Value<number>
	focus_enabled?: Value<boolean>
	focus_wrap_enabled?: Value<boolean>
	focus_magnet_enabled?: Value<boolean>
	focus_identifier?: Value<string>
	focus_change_down?: Value<string>
	focus_change_up?: Value<string>
	focus_change_left?: Value<string>
	focus_change_right?: Value<string>
	focus_mapping?: Array<FocusMapping>
	focus_container?: Value<boolean>
	use_last_focus?: Value<boolean>
	focus_navigation_mode_left?: Value<string | FocusNavigationMode>
	focus_navigation_mode_right?: Value<string | FocusNavigationMode>
	focus_navigation_mode_down?: Value<string | FocusNavigationMode>
	focus_navigation_mode_up?: Value<string | FocusNavigationMode>
	focus_container_custom_left?: Value<string | FocusContainerCustom>
	focus_container_custom_right?: Value<string | FocusContainerCustom>
	focus_container_custom_down?: Value<string | FocusContainerCustom>
	focus_container_custom_up?: Value<string | FocusContainerCustom>
}
