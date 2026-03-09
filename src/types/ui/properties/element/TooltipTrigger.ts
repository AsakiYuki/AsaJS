import { Value } from "../value.js"

export interface TooltipTrigger {
	tooltip_name?: Value<string>
	tooltip_top_content_control?: Value<string>
	tooltip_bottom_content_control?: Value<string>
	tooltip_area?: Value<string>
	tooltip_tts_value?: Value<string>
}
