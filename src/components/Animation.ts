import { AnimType } from "../types/enums/AnimType.js"
import { SmartAnimation } from "../types/enums/SmartAnimation.js"
import { AnimationProperties } from "../types/properties/element/Animation.js"
import { Class } from "./Class.js"
import { KeyframeController } from "./KeyframeController.js"

import util from "node:util"

type Anim<T extends AnimType> = AnimationProperties<T> | number
type AnimWithSmartAnimation<T extends AnimType> = [SmartAnimation | Anim<T>, ...Anim<T>[]]

export class Animation<T extends AnimType> extends Class {
	protected keyframes: KeyframeController<AnimType>[] = []
	protected loop = false
	private smartAnimationMode: SmartAnimation = "none"

	constructor(
		readonly type: T,
		...keyframes: AnimWithSmartAnimation<T>
	) {
		super()

		if ([AnimType.ASEPRITE_FLIP_BOOK, AnimType.FLIP_BOOK, AnimType.WAIT].includes(type)) {
			throw new Error(`${type} is not need for Animation constructor, please use AnimetionKeyframe instead!`)
		}

		if (typeof keyframes[0] === "string") {
			this.smartAnimationMode = keyframes[0]
			this.addKeyframes(...(keyframes.slice(1) as Anim<T>[]))
		} else this.addKeyframes(...(keyframes as Anim<T>[]))
	}

	protected lastKey() {
		return this.keyframes[this.keyframes.length - 1]
	}

	protected firstKey() {
		return this.keyframes[0]
	}

	at(index: number) {
		const frame = this.keyframes[index]
		if (frame) return frame
		else throw new Error(`No frame at index ${index}`)
	}

	private transformKeyframe(keyframe: Anim<T>) {
		if (typeof keyframe === "number") {
			return { type: AnimType.WAIT, properties: <AnimationProperties<T>>(<unknown>{ duration: keyframe }) }
		} else {
			return { type: this.type, properties: keyframe }
		}
	}

	private addKeyframes(...keyframes: Anim<T>[]) {
		if (this.smartAnimationMode === "none") {
			for (const $ of keyframes) {
				const { type, properties } = this.transformKeyframe($)
				const keyframeController = new KeyframeController(type, properties)
				const prevKeyframe = this.lastKey()
				if (prevKeyframe) prevKeyframe.setNext(keyframeController)
				this.keyframes.push(keyframeController)
			}
		} else if (this.smartAnimationMode === "frame") {
			let lastDuration = 0

			for (const $ of keyframes) {
				const { type, properties } = <{ type: AnimType; properties: { from?: unknown; to?: unknown } }>(
					(<unknown>this.transformKeyframe($))
				)

				if ((<{ duration?: number }>(<unknown>properties)).duration !== undefined)
					lastDuration = (<{ duration?: number }>(<unknown>properties)).duration || 0
				;(<{ duration?: number }>(<unknown>properties)).duration = lastDuration

				if (type !== AnimType.WAIT) {
					const { from, to } = properties
					if (from === undefined) properties.from = to
					else if (to === undefined) properties.to = from
				}

				const keyframeController = new KeyframeController(type, <AnimationProperties<T>>properties)
				const prevKeyframe = this.lastKey()
				if (prevKeyframe) prevKeyframe.setNext(keyframeController)
				this.keyframes.push(keyframeController)
			}
		} else if (this.smartAnimationMode === "smooth" || this.smartAnimationMode === "smooth_loop") {
			let lastDuration = 0,
				lastTo

			for (const $ of keyframes) {
				const { type, properties } = <{ type: AnimType; properties: { from?: unknown; to?: unknown } }>(
					(<unknown>this.transformKeyframe($))
				)

				if (properties.to === undefined && type !== AnimType.WAIT)
					throw new Error(`To property is required in smooth mode`)

				if ((<{ duration?: number }>(<unknown>properties)).duration !== undefined)
					lastDuration = (<{ duration?: number }>(<unknown>properties)).duration || 0
				;(<{ duration?: number }>(<unknown>properties)).duration = lastDuration

				if (type !== AnimType.WAIT) {
					if (properties.to) {
						if (properties.from === undefined) properties.from = lastTo
						lastTo = properties.to
					}
				}

				const keyframeController = new KeyframeController(type, <AnimationProperties<T>>properties)
				const prevKeyframe = this.lastKey()
				if (prevKeyframe) prevKeyframe.setNext(keyframeController)
				this.keyframes.push(keyframeController)
			}

			if (this.smartAnimationMode === "smooth_loop") {
				const firstKey = <{ properties: { from?: unknown } }>(<unknown>this.firstKey())
				if (firstKey.properties.from === undefined && lastTo !== undefined) {
					firstKey.properties.from = lastTo
				}
			}
		} else throw new Error(`Unknown smart animation mode: ${this.smartAnimationMode}`)

		if (this.loop) this.lastKey().setNext(this.firstKey())
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

	protected toString() {
		return String(this.firstKey())
	}

	protected [util.inspect.custom]($: any, opts: any) {
		const out = this.keyframes.map((v, i) => {
			return `  \x1b[33m${i}\x1b[0m: \x1b[33mKeyframe\x1b[0m<\x1b[92m${v.type}\x1b[0m> \x1b[92m"${v}\x1b[92m"\x1b[0m ${util.inspect(v.serialize(), opts)}`.replace(
				/\n/g,
				"\n  ",
			)
		})

		return `\x1b[33mAnimation\x1b[0m<\x1b[92m${this.type}\x1b[0m> \x1b[92m"${this}\x1b[92m"\x1b[0m {\n${out.join("\n")}\n}\n`
	}
}
