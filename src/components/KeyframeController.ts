import { AnimType } from "../types/enums/AnimType.js"
import { KeyframeAnimationProperties } from "../types/properties/element/Animation.js"
import { AnimationKeyframe } from "./AnimationKeyframe.js"

export class KeyframeController<T extends AnimType> extends AnimationKeyframe<T> {
	constructor(type: T, properties: KeyframeAnimationProperties<T>, name?: string, namespace?: string, path?: string) {
		super(type, properties, name, namespace, path)
	}

	serialize() {
		return this.toJsonUI()
	}
}
