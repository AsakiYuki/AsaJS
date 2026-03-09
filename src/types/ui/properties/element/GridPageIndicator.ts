import { Value } from "../value.js"

export interface GridPageIndicator {
	grid_item_when_current?: Value<string>
	grid_item_when_not_current?: Value<string>
	cycler_manager_size_control_target?: Value<string>
}
