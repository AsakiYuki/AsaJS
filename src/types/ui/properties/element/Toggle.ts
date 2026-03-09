import { CollectionName } from "../../enums/CollectionName.js"
import { ToggleName } from "../../enums/ToggleName.js"
import { Value } from "../value.js"

export interface Toggle {
	radio_toggle_group?: Value<string>
	toggle_name?: Value<string | ToggleName>
	toggle_default_state?: Value<boolean>
	toggle_group_forced_index?: Value<number>
	toggle_group_default_selected?: Value<boolean>
	reset_on_focus_lost?: Value<boolean>
	toggle_on_hover?: Value<string>
	toggle_on_button?: Value<string>
	toggle_off_button?: Value<string>
	enable_directional_toggling?: Value<boolean>
	toggle_grid_collection_name?: Value<string | CollectionName>
	checked_control?: Value<string>
	unchecked_control?: Value<string>
	checked_hover_control?: Value<string>
	unchecked_hover_control?: Value<string>
	checked_locked_control?: Value<string>
	unchecked_locked_control?: Value<string>
	checked_locked_hover_control?: Value<string>
	unchecked_locked_hover_control?: Value<string>
}
