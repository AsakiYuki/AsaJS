import { FontType } from "../../enums/FontType.js"
import { TextAlignment } from "../../enums/TextAlignment.js"
import { AnimValue, Array3, Value } from "../value.js"

export interface Text {
	text?: Value<string>
	color?: AnimValue<Array3<number>>
	locked_color?: AnimValue<Array3<number>>
	shadow?: Value<boolean>
	hide_hyphens?: Value<boolean>
	notify_on_ellipses?: Value<Array<string>>
	notify_ellipses_sibling?: Value<string>
	enable_profanity_filter?: Value<boolean>
	locked_alpha?: AnimValue<number>
	font_size?: Value<string>
	font_scale_factor?: Value<number>
	localize?: Value<boolean>
	line_padding?: Value<number>
	font_type?: Value<string | FontType>
	backup_font_type?: Value<string | FontType>
	text_alignment?: Value<string | TextAlignment>
	alignment?: Value<string | TextAlignment>
	use_place_holder?: Value<boolean>
	place_holder_text?: Value<string>
	place_holder_text_color?: AnimValue<Array3<number>>
}
