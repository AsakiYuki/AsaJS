import { Value } from "../value.js"

export interface Button {
	default_control?: Value<string>
	hover_control?: Value<string>
	pressed_control?: Value<string>
	locked_control?: Value<string>
}
