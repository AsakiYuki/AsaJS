import { AnimationKeyframe } from "../../../components/AnimationKeyframe.js"
import { AnimType } from "../../enums/AnimType.js"
import { Easing } from "../../enums/Easing.js"
import { Array2, Array3, Value } from "../value.js"

export interface Animation {
	anim_type?: Value<string | AnimType>
	duration?: Value<number>
	next?: Value<string | AnimationKeyframe>
	destroy_at_end?: Value<string>
	play_event?: Value<string>
	end_event?: Value<string>
	start_event?: Value<string>
	reset_event?: Value<string>
	easing?: Value<string | Easing>
	from?: Value<number | string | Array3<number> | Array2<string>>
	to?: Value<number | string | Array3<number> | Array2<string>>
	initial_uv?: Value<Array2<number>>
	fps?: Value<number>
	frame_count?: Value<number>
	frame_step?: Value<number>
	reversible?: Value<boolean>
	resettable?: Value<boolean>
	scale_from_starting_alpha?: Value<boolean>
	activated?: Value<string>
	looping?: Value<boolean>
	wait_until_rendered_to_play?: Value<boolean>
}
