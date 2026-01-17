import { FormatProperties } from "../compilers/FormatProperties.js"
import { Memory } from "../compilers/Memory.js"
import { Renderer } from "../types/enums/Renderer.js"
import { Type } from "../types/enums/Type.js"
import { Properties } from "../types/properties/components.js"
import { Namespace, VanillaType } from "../types/vanilla/intellisense.js"
import { Class } from "./Class.js"
import { RandomString } from "./Utils.js"

import util from "node:util"

export class UI<T extends Type, K extends Renderer | null = null> extends Class {
	path: string

	name: string
	namespace: string
	extend?: UI<Type, Renderer | null>

	canExtend: boolean

	controls = new Map<string, [UI<Type, Renderer | null>, Properties<Type, Renderer | null>]>()
	properties: Properties<T, K> = <any>{}

	constructor(
		public type?: T,
		name?: string,
		namespace?: string,
		path?: string,
	) {
		super()

		if (name === "namespace") {
			console.error("The 'namespace' cannot be used as a name")
			process.exit(1)
		}

		this.name = name?.match(/^(\w|\/)+/)?.[0] || RandomString(16)
		this.namespace = namespace || RandomString(16)

		if (!path) this.path = `@/${this.namespace}`
		else this.path = path

		this.canExtend = this.name.search("/") === -1

		Memory.register_ui(this.path, this)
	}

	setProperties(properties: Properties<T, K>) {
		this.properties = { ...this.properties, ...properties }
		return this
	}

	addChild<T extends Type, K extends Renderer | null>(child: UI<T, K>, properties?: Properties<T, K>, name?: string) {
		if (this === <any>child) {
			throw new Error("Cannot add a child to itself")
		}

		this.controls.set(name || RandomString(16), [child, properties || {}])
		return this
	}

	toString() {
		return `@${this.namespace}.${this.name}`
	}

	toJSON() {
		const obj: any = {
			...FormatProperties(this.properties),
		}

		if (this.type) {
			obj.type = this.type
		}

		if (this.controls.size) {
			obj.controls = []
			this.controls.forEach((e, key) => obj.controls.push({ [key + e[0]]: e[1] }))
		}

		return obj
	}

	[util.inspect.custom]($: any, opts: any) {
		const obj: any = FormatProperties(this.properties)

		if (this.controls.size) {
			obj.controls = []
			this.controls.forEach((e, key) => obj.controls.push({ [key + e[0]]: e[1] }))
		}

		return `\x1b[33mUI\x1b[0m<\x1b[92m${
			this.type || this.extend ? `${this.extend}` : "ANY"
		}\x1b[0m> \x1b[92m"${this}\x1b[92m"\x1b[0m ${util.inspect(obj, opts)}\n`
	}
}
