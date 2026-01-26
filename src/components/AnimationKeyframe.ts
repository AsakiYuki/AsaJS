import { FormatAnimationProperties } from "../compilers/FormatProperties.js"
import { Memory } from "../compilers/Memory.js"
import { AnimType } from "../types/enums/AnimType.js"
import { KeyframeAnimationProperties } from "../types/properties/element/Animation.js"
import { Animation } from "./Animation.js"
import { Class } from "./Class.js"
import { RandomString } from "./Utils.js"

import util from "node:util"

export class AnimationKeyframe<T extends AnimType> extends Class {
	readonly path: string
	readonly name: string
	readonly namespace: string

	readonly extend?: AnimationKeyframe<T> | Animation<T>

	constructor(
		readonly type: T,
		readonly properties: KeyframeAnimationProperties<T>,
		name?: string,
		namespace?: string,
		path?: string,
	) {
		super()

		if (name === "namespace") {
			console.error("The 'namespace' cannot be used as a name")
			process.exit(1)
		}

		if (namespace && !/^\w+$/.test(namespace)) {
			console.error(`The '${namespace}' cannot be used as a namespace`)
			process.exit(1)
		}

		this.name = name || RandomString(16)
		this.namespace = namespace || RandomString(16)
		this.path = path || `@/${this.namespace}`

		Memory.add(this)
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

	protected toJSON() {
		if (this.extend) {
			return this.toJsonUI()
		} else {
			return {
				anim_type: this.type,
				...this.toJsonUI(),
			}
		}
	}

	protected toString() {
		return `@${this.namespace}.${this.name}`
	}

	protected [util.inspect.custom]($: any, opts: any) {
		return `\x1b[33mAnimationKeyFrame\x1b[0m<\x1b[92m${
			this.type
		}\x1b[0m> \x1b[92m"${this}\x1b[92m"\x1b[0m ${util.inspect(this.toJsonUI(), opts)}\n`
	}
}
