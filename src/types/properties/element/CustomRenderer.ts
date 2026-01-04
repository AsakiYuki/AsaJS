import { DebugColor } from "../../enums/DebugColor.js"
import { Orientation } from "../../enums/Orientation.js"
import { Renderer } from "../../enums/Renderer.js"
import { Rotation } from "../../enums/Rotation.js"
import { Array3, Array4, Value } from "../value.js"

export interface CustomRenderer {
	renderer?: Value<Renderer>
	replaced_while_inactive?: Value<boolean>
}

export interface PaperDollRenderer {
	camera_tilt_degrees?: Value<number>
	starting_rotation?: Value<number>
	use_selected_skin?: Value<boolean>
	use_uuid?: Value<boolean>
	use_skin_gui_scale?: Value<boolean>
	use_player_paperdoll?: Value<boolean>
	rotation?: Value<string | Rotation>
	modelsize?: Value<number>
	animation_looped?: Value<boolean>
	animation?: Value<string>
}

export interface NeteasePaperDollRenderer {
	screen_offset?: null
	screen_scale?: Value<number>
	mob_body_rot_y?: Value<number>
	mob_head_rot_y?: Value<number>
	init_rot_y?: Value<number>
	skeleton_model_name?: Value<string>
	entity_identifier?: Value<string>
}

export interface NeteaseMiniMapRenderer {
	size_grade?: null
	use_default_face_icon?: Value<boolean>
	face_icon_bg_color?: Value<Array3<number>>
	enable_live_update?: Value<boolean>
	live_update_interval?: Value<number>
	highest_y?: Value<number>
}

export interface ProgressBarRenderer {
	primary_color?: Value<Array3<number>>
	secondary_color?: Value<Array3<number>>
	full_storage_color?: Value<Array3<number>>
}

export interface GradientRenderer {
	gradient_direction?: Value<string | Orientation>
	color1?: Value<Array3<number> | Array4<number>>
	color2?: Value<Array3<number> | Array4<number>>
}

export interface NameTagRenderer {
	text_color?: Value<Array3<number>>
	background_color?: Value<Array3<number>>
}

export interface HoverTextRenderer {
	hover_text_max_width?: Value<number>
}

export interface Debug {
	debug?: Value<DebugColor>
}

export interface EquipmentPreviewRenderer {
	rotation_x?: Value<number>
	rotation_y?: Value<number>
}
