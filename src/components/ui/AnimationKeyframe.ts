import path from "path"
import { AnimType } from "../../types/ui/enums/AnimType.js"
import { GetRandomNamespace, GetRandomString } from "../../utils/Random.js"
import { GetUIStorage } from "../../compiler/ui/uistorage.js"
import { KeyframeAnimationProperties } from "../../types/ui/properties/element/Animation.js"
import { FormatAnimationProperties } from "../../compiler/properties.js"
import { defaultNamespace } from "../../utils/Utils.js"

export class AnimationKeyframe<T extends AnimType> {
	constructor(
		protected readonly type: T,
		protected readonly properties: KeyframeAnimationProperties<T>,
		protected readonly name?: string,
		protected readonly namespace?: string,
	) {
		this.name ||= GetRandomString()
		this.namespace ||= defaultNamespace || GetRandomNamespace()
		GetUIStorage(this.namespace, path.join("ui", "build", this.namespace + ".json")).add(this.name, this)
	}

	setNext(keyframe: AnimationKeyframe<AnimType>) {
		this.properties.next = keyframe
		return this
	}

	clearNext() {
		delete this.properties.next
		return this
	}

	protected toJsonUI() {
		return FormatAnimationProperties(this.properties)
	}

	toString() {
		return `@${this.namespace}.${this.name}`
	}

	toJSON() {
		return {
			anim_type: this.type,
			...this.toJsonUI(),
		}
	}
}
