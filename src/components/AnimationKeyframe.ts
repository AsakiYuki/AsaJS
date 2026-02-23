import { config, isNotObfuscate, uiBuildFolder } from "../compilers/Configuration.js"
import { FormatAnimationProperties } from "../compilers/FormatProperties.js"
import { Memory } from "../compilers/Memory.js"
import { AnimType } from "../types/enums/AnimType.js"
import { KeyframeAnimationProperties } from "../types/properties/element/Animation.js"
import { Animation } from "./Animation.js"
import { Class } from "./Class.js"
import { defaultNamespace, RandomNamespace, RandomString } from "./Utils.js"
import nodepath from "path"

import util from "node:util"

const fileExt = config.compiler?.fileExtension
	? config.compiler.fileExtension.startsWith(".")
		? config.compiler.fileExtension
		: `.${config.compiler.fileExtension}`
	: ".json"

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
		allowObfuscate?: boolean,
	) {
		super()

		if (name === "namespace") {
			console.error("The 'namespace' cannot be used as a name")
			process.exit(1)
		}

		if (isNotObfuscate || !(allowObfuscate ?? true)) {
			this.name = name?.match(/^(\w|\/)+/)?.[0] || RandomString(16)
			this.namespace = namespace || defaultNamespace || RandomNamespace()
		} else {
			this.name = RandomString(16)
			this.namespace = RandomNamespace()
		}

		if (!path) this.path = nodepath.join(uiBuildFolder, `${this.namespace}${fileExt}`)
		else this.path = path

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
