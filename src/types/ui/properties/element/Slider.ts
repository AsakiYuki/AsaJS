import { ButtonId } from "../../enums/ButtonId.js"
import { CollectionName } from "../../enums/CollectionName.js"
import { Orientation } from "../../enums/Orientation.js"
import { SliderName } from "../../enums/SliderName.js"
import { Value } from "../value.js"

export interface Slider {
	slider_track_button?: Value<string>
	slider_small_decrease_button?: Value<string | ButtonId>
	slider_small_increase_button?: Value<string | ButtonId>
	slider_steps?: Value<number>
	slider_direction?: Value<string | Orientation>
	slider_timeout?: Value<number>
	slider_collection_name?: Value<string | CollectionName>
	slider_name?: Value<string | SliderName>
	slider_select_on_hover?: Value<boolean>
	slider_selected_button?: Value<string | ButtonId>
	slider_deselected_button?: Value<string | ButtonId>
	slider_box_control?: Value<string>
	background_control?: Value<string>
	background_hover_control?: Value<string>
	progress_control?: Value<string>
	progress_hover_control?: Value<string>
}
