import { ClipDirection } from "../../enums/ClipDirection.js"
import { AnimValue, Array2, Array3, Array4, Value } from "../value.js"

export interface Sprite {
	texture?: Value<string>
	allow_debug_missing_texture?: Value<boolean>
	uv?: AnimValue<Array2<number>>
	uv_size?: AnimValue<Array2<number>>
	texture_file_system?: Value<string>
	nineslice_size?: AnimValue<Array2<number> | Array3<number> | Array4<number>>
	tiled?: Value<boolean>
	tiled_scale?: Value<Array<number>>
	clip_direction?: Value<string | ClipDirection>
	clip_ratio?: Value<number>
	clip_pixelperfect?: Value<boolean>
	pixel_perfect?: Value<boolean>
	keep_ratio?: Value<boolean>
	bilinear?: Value<boolean>
	fill?: Value<boolean>
	fit_to_width?: Value<boolean>
	zip_folder?: Value<string>
	grayscale?: Value<boolean>
	force_texture_reload?: Value<boolean>
	base_size?: Value<Array2<number>>
	color_corrected?: Value<boolean>
}
