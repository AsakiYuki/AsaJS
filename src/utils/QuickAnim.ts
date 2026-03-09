import { Animation } from "../components/ui/Animation.js"
import { AnimationKeyframe } from "../components/ui/AnimationKeyframe.js"
import { AnimType } from "../types/ui/enums/AnimType.js"
import { SmartAnimation } from "../types/ui/enums/SmartAnimation.js"
import { AnimationProperties, KeyframeAnimationProperties } from "../types/ui/properties/element/Animation.js"

// Quick Keyframe
export function OffsetKeyframe(
	properties?: KeyframeAnimationProperties<AnimType.OFFSET>,
	namespace?: string,
	name?: string,
) {
	return new AnimationKeyframe(AnimType.OFFSET, properties || {}, name, namespace)
}

export function SizeKeyframe(
	properties?: KeyframeAnimationProperties<AnimType.SIZE>,
	namespace?: string,
	name?: string,
) {
	return new AnimationKeyframe(AnimType.SIZE, properties || {}, name, namespace)
}

export function UVKeyframe(properties?: KeyframeAnimationProperties<AnimType.UV>, namespace?: string, name?: string) {
	return new AnimationKeyframe(AnimType.UV, properties || {}, name, namespace)
}

export function ClipKeyframe(
	properties?: KeyframeAnimationProperties<AnimType.CLIP>,
	namespace?: string,
	name?: string,
) {
	return new AnimationKeyframe(AnimType.CLIP, properties || {}, name, namespace)
}

export function ColorKeyframe(
	properties?: KeyframeAnimationProperties<AnimType.COLOR>,
	namespace?: string,
	name?: string,
) {
	return new AnimationKeyframe(AnimType.COLOR, properties || {}, name, namespace)
}

export function AlphaKeyframe(
	properties?: KeyframeAnimationProperties<AnimType.ALPHA>,
	namespace?: string,
	name?: string,
) {
	return new AnimationKeyframe(AnimType.ALPHA, properties || {}, name, namespace)
}

export function WaitKeyframe(
	properties?: KeyframeAnimationProperties<AnimType.WAIT>,
	namespace?: string,
	name?: string,
) {
	return new AnimationKeyframe(AnimType.WAIT, properties || {}, name, namespace)
}

export function FlipBookKeyframe(
	properties?: KeyframeAnimationProperties<AnimType.FLIP_BOOK>,
	namespace?: string,
	name?: string,
) {
	return new AnimationKeyframe(AnimType.FLIP_BOOK, properties || {}, name, namespace)
}

export function AsepriteFlipBookKeyframe(
	properties?: KeyframeAnimationProperties<AnimType.ASEPRITE_FLIP_BOOK>,
	namespace?: string,
	name?: string,
) {
	return new AnimationKeyframe(AnimType.ASEPRITE_FLIP_BOOK, properties || {}, name, namespace)
}

// Quick Animation
export type AnimationByType<T extends AnimType> = AnimationProperties<T> | number
export type AnimWithSmartAnim<T extends AnimType> = [SmartAnimation | AnimationByType<T>, ...AnimationByType<T>[]]

export function OffsetAnimation(...keyframes: AnimWithSmartAnim<AnimType.OFFSET>) {
	return new Animation(AnimType.OFFSET, ...keyframes)
}

export function SizeAnimation(...keyframes: AnimWithSmartAnim<AnimType.SIZE>) {
	return new Animation(AnimType.SIZE, ...keyframes)
}

export function UVAnimation(...keyframes: AnimWithSmartAnim<AnimType.UV>) {
	return new Animation(AnimType.UV, ...keyframes)
}

export function ClipAnimation(...keyframes: AnimWithSmartAnim<AnimType.CLIP>) {
	return new Animation(AnimType.CLIP, ...keyframes)
}

export function ColorAnimation(...keyframes: AnimWithSmartAnim<AnimType.COLOR>) {
	return new Animation(AnimType.COLOR, ...keyframes)
}

export function AlphaAnimation(...keyframes: AnimWithSmartAnim<AnimType.ALPHA>) {
	return new Animation(AnimType.ALPHA, ...keyframes)
}
