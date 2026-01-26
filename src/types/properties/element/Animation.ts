import { AnimationKeyframe } from "../../../components/AnimationKeyframe.js"
import { AnimType } from "../../enums/AnimType.js"
import { Easing } from "../../enums/Easing.js"
import { Array2, Array3, Value } from "../value.js"

export interface DurationAnimation {
	duration?: Value<number>
}

export interface EasingAnimation extends DurationAnimation {
	easing?: Value<string | Easing>
}

export interface NumberAnimation extends DurationAnimation, EasingAnimation {
	from: Value<number>
	to: Value<number>
}

export interface Array2Animation extends DurationAnimation, EasingAnimation {
	from: Array2<number | string>
	to: Array2<number | string>
}

export interface Array3Animation extends DurationAnimation, EasingAnimation {
	from: Array3<number | string>
	to: Array3<number | string>
}

export interface AsepriteFlipBookAnimation {
	initial_uv?: Value<Array2<number>>
}

export interface FlipbookAnimation extends AsepriteFlipBookAnimation {
	frame_count?: Value<number>
	frame_step?: Value<number>
	fps?: Value<number>
	easing?: Value<string | Easing>
}

export interface AnimationValueType {
	[AnimType.OFFSET]: Array2Animation
	[AnimType.SIZE]: Array2Animation
	[AnimType.UV]: Array2Animation
	[AnimType.CLIP]: Array2Animation
	[AnimType.COLOR]: Array3Animation
	[AnimType.ALPHA]: NumberAnimation
	[AnimType.WAIT]: DurationAnimation
	[AnimType.FLIP_BOOK]: FlipbookAnimation
	[AnimType.ASEPRITE_FLIP_BOOK]: AsepriteFlipBookAnimation
}

export interface AnimationPropertiesItem {
	destroy_at_end?: Value<string>
	play_event?: Value<string>
	end_event?: Value<string>
	start_event?: Value<string>
	reset_event?: Value<string>

	reversible?: Value<boolean>
	resettable?: Value<boolean>
	scale_from_starting_alpha?: Value<boolean>
	activated?: Value<string>
	looping?: Value<boolean>
	wait_until_rendered_to_play?: Value<boolean>
}

export interface KeyframeAnimationPropertiesItem extends AnimationPropertiesItem {
	next?: Value<string | AnimationKeyframe<AnimType>>
}

export type KeyframeAnimationProperties<T extends keyof AnimationValueType> = Partial<AnimationValueType[T]> &
	KeyframeAnimationPropertiesItem

export type AnimationProperties<T extends keyof AnimationValueType> = Partial<AnimationValueType[T]> &
	AnimationPropertiesItem
