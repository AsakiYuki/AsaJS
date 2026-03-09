import { Value } from "../value.js"

export interface Tab {
	tab_index?: Value<number>
	tab_control?: Value<string>
	tab_content?: Value<string>
}
