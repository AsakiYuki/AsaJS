import { AnimType } from "../types/enums/AnimType.js"
import { AnimationProperties } from "../types/properties/element/Animation.js"
import { Class } from "./Class.js"
import { KeyframeController } from "./KeyframeController.js"

export class Animation<T extends AnimType> extends Class {
	protected keyframes: KeyframeController<AnimType>[] = []
	protected loop = false

	constructor(
		readonly type: T,
		...keyframes: (AnimationProperties<T> | number)[]
	) {
		super()
		if (type === AnimType.WAIT) console.warn("Why are you create a wait animation?")
		this.addKeyframes(...keyframes)
	}

	protected lastKey() {
		return this.keyframes[this.keyframes.length - 1]
	}

	protected firstKey() {
		return this.keyframes[0]
	}

	addKeyframes(...keyframes: (AnimationProperties<T> | number)[]) {
		for (const $ of keyframes) {
			let keyframe: AnimationProperties<AnimType>, animType: AnimType

			if (typeof $ === "number") {
				keyframe = { duration: $ }
				animType = AnimType.WAIT
			} else {
				keyframe = $
				animType = this.type
			}

			const keyframeController = new KeyframeController(animType, keyframe as AnimationProperties<T>)

			const prevKeyframe = this.lastKey()
			if (prevKeyframe) prevKeyframe.setNext(keyframeController)

			if (this.loop) keyframeController.setNext(this.firstKey() as KeyframeController<T>)

			this.keyframes.push(keyframeController)
		}
	}

	setLoop(boolean: boolean) {
		this.loop = boolean

		if (this.loop) {
			const prevKeyframe = this.lastKey()
			if (prevKeyframe) prevKeyframe.setNext(this.firstKey() as KeyframeController<T>)
		} else {
			const prevKeyframe = this.lastKey()
			if (prevKeyframe) prevKeyframe.clearNext()
		}

		return this
	}
}
