import { Value } from "../value.js"

export interface Dropdown {
	dropdown_name?: Value<string>
	dropdown_content_control?: Value<string>
	dropdown_area?: Value<string>
}
