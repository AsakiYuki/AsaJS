import { Value } from "../value.js"
import { Sprite } from "./Sprite.js"

export interface Image extends Sprite {
	fill?: Value<boolean>
	texture_path?: Value<string>
	texture?: Value<string>
}

export interface Cycler {
	target_cycler_to_compare?: Value<string>
	next_sub_page_button_name?: Value<string>
	prev_sub_page_button_name?: Value<string>
}

export interface LabelCycler {
	text_labels?: Value<Array<string>>
}

export interface ImageCycler {
	images?: Value<Array<Image>>
}
