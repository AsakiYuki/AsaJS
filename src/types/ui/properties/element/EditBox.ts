import { CollectionName } from "../../enums/CollectionName.js"
import { TextboxName } from "../../enums/TextboxName.js"
import { TextType } from "../../enums/TextType.js"
import { Array3, Value } from "../value.js"

export interface EditBox {
	text_box_name?: Value<string | TextboxName>
	text_edit_box_grid_collection_name?: Value<string | CollectionName>
	constrain_to_rect?: Value<boolean>
	enabled_newline?: Value<boolean>
	text_type?: Value<string | TextType>
	max_length?: Value<number>
	text_control?: Value<string>
	place_holder_control?: Value<string>
	can_be_deselected?: Value<boolean>
	always_listening?: Value<boolean>
	virtual_keyboard_buffer_control?: Value<string>
	place_holder_text_hover_color?: Value<Array3<number>>
}
