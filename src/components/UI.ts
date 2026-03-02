import { FormatProperties } from "../compilers/FormatProperties.js"
import { Memory } from "../compilers/Memory.js"
import { AnimType } from "../types/enums/AnimType.js"
import { ArrayName } from "../types/enums/ArrayName.js"
import { Operation } from "../types/enums/Operation.js"
import { Renderer } from "../types/enums/Renderer.js"
import { Type } from "../types/enums/Type.js"
import { Properties } from "../types/properties/components.js"
import {
	BindingItem,
	ButtonMapping,
	Control,
	ModificationItem,
	VariableItem,
	Variables,
} from "../types/properties/value.js"
import { Animation } from "./Animation.js"
import { AnimationKeyframe } from "./AnimationKeyframe.js"
import { Class } from "./Class.js"
import { defaultNamespace, RandomNamespace, RandomString, ResolveBinding } from "./Utils.js"
import nodepath from "path"

import util from "node:util"
import { config, isNotObfuscate, uiBuildFolder } from "../compilers/Configuration.js"
import { FactoryManager } from "./Factory.js"

interface ExtendUI {
	name: string
	namespace: string
	toString(): string
}

const fileExt = config.compiler?.fileExtension
	? config.compiler.fileExtension.startsWith(".")
		? config.compiler.fileExtension
		: `.${config.compiler.fileExtension}`
	: ".json"

type ChildInput<C extends UI<Type, Renderer | null>> = {
	child: C
	properties?: C extends UI<infer T, infer K> ? Partial<Properties<T, K>> : never
	name?: string
	callback?: (name: string, parent: UI<Type, Renderer | null>) => void
}

export class UI<T extends Type, K extends Renderer | null = null> extends Class {
	readonly path: string
	readonly name: string
	readonly namespace: string

	readonly extend?: UI<Type, Renderer | null> | ExtendUI
	readonly extendable: boolean

	protected readonly controls = new Map<string, [UI<Type, Renderer | null>, Properties<Type, Renderer | null>]>()
	protected readonly bindings: BindingItem[] = []
	protected readonly variables: VariableItem[] = []
	protected readonly buttonMappings: ButtonMapping[] = []
	protected readonly anims: (Animation<AnimType> | AnimationKeyframe<AnimType>)[] = []
	protected readonly extendType?: Type
	protected factory?: FactoryManager

	protected properties: Properties<T, K> = <any>{}
	protected bindCache = new Map<string, unknown>()

	constructor(
		public type?: T,
		name?: string,
		namespace?: string,
		path?: string,
		allowObfuscate?: boolean,
	) {
		super()

		if (isNotObfuscate || !(allowObfuscate ?? true)) {
			this.name = name || RandomString(16)
			this.namespace = namespace || defaultNamespace || RandomNamespace()
		} else {
			this.name = RandomString(16)
			this.namespace = RandomNamespace()
		}

		if (!path) this.path = nodepath.join(uiBuildFolder, `${this.namespace}${fileExt}`)
		else this.path = path

		this.extendable = this.name.search("/") === -1

		Memory.add(this)
	}

	/**
	 * Set properties for this element
	 * @param properties
	 * @returns
	 */
	setProperties(properties: Properties<T, K>) {
		this.properties = { ...this.properties, ...properties }
		return this
	}

	setFactory(factory: FactoryManager) {
		this.factory = factory
		return this
	}

	/**
	 * Bind data (coming from the code) to this UI element to use.
	 * @param bindings
	 * @returns
	 */
	addBindings(...bindings: BindingItem[]) {
		this.bindings.push(...ResolveBinding(this.bindCache, ...bindings))
		return this
	}

	/**
	 * Changes variables values if conditions are met.
	 * @param variables
	 * @returns
	 */
	addVariables(variables: Variables) {
		Object.entries(variables).forEach(([key, value]) => {
			this.variables.push({
				requires: key,
				...value,
			})
		})

		return this
	}

	/**
	 * Add button mappings for this element
	 * @param mappings
	 * @returns
	 */
	addButtonMappings(...mappings: ButtonMapping[]) {
		this.buttonMappings.push(...mappings)
		return this
	}

	/**
	 * Children of the UI element.
	 * @param child
	 * @param properties
	 * @param name
	 * @returns
	 */
	addChild<T extends Type, K extends Renderer | null>(
		child: UI<T, K>,
		properties?: Properties<T, K>,
		name?: string,
		callback?: (name: string, parent: UI<T, K>) => void,
	) {
		if (this === <any>child) throw new Error("Cannot add a child to itself")
		const childName = name || RandomString(16)
		this.controls.set(childName, [child, properties || {}])
		callback?.(childName, <any>this)
		return this
	}

	addChilds<UIs extends readonly UI<Type, Renderer | null>[]>(...childs: { [K in keyof UIs]: ChildInput<UIs[K]> }) {
		const childrenList = childs as unknown as ChildInput<UI<Type, Renderer | null>>[]

		childrenList.forEach(({ child, properties, name, callback }) => {
			this.addChild(child, properties, name, callback)
		})

		return this
	}

	addAnimations(...anims: (Animation<AnimType> | AnimationKeyframe<AnimType>)[]) {
		this.anims.push(...anims)
		return this
	}

	/**
	 * Return a extend of this element
	 * @param properties
	 * @param name
	 * @param namespace
	 * @returns
	 */
	createExtends(properties?: Properties<T, K>, name?: string, namespace?: string) {
		if (!this.extendable) throw new Error("This element is not extendable")
		const ui = new UI<T, K>(undefined, name, namespace)
		if (properties) ui.setProperties(properties)
		// @ts-ignore
		ui.extend = this
		// @ts-ignore
		ui.extendType = this.type || this.extendType
		return ui
	}

	toString(): Control {
		return `@${this.namespace}.${this.name}`
	}

	protected toJsonUI() {
		const obj: any = {
			...FormatProperties(this.properties),
		}

		if (this.type) obj.type = this.type

		if (this.bindings.length) obj.bindings = this.bindings
		if (this.variables.length) obj.variables = this.variables
		if (this.buttonMappings.length) obj.button_mappings = this.buttonMappings
		if (this.factory) obj.factory = this.factory

		if (this.anims.length) obj.anims = this.anims.map(a => String(a))

		if (this.controls.size) {
			obj.controls = []
			this.controls.forEach((e, key) => obj.controls.push({ [key + e[0]]: FormatProperties(e[1]) }))
		}

		return obj
	}

	protected toJSON() {
		return this.toJsonUI()
	}

	protected [util.inspect.custom]($: any, opts: any) {
		return `\x1b[33mUI\x1b[0m<\x1b[92m${
			this.type || (this.extend ? `${this.extendType || "unknown"}:${this.extend}` : "unknown")
		}\x1b[0m> \x1b[92m"${this}\x1b[92m"\x1b[0m ${util.inspect(this.toJsonUI(), opts)}\n`
	}
}

export class ModifyUI<T extends Type = Type.PANEL, S extends string = string> extends UI<T, null> {
	private isClearBinding: boolean = false
	private isClearVariables: boolean = false
	private isClearControls: boolean = false
	private isClearAnims: boolean = false
	private isClearButtonMappings: boolean = false

	protected modifications: ModificationItem[] = []

	constructor(namespace: string, name: string, path: string) {
		super(undefined, name, namespace, path, false)
	}

	clearArray(arrayName: ArrayName) {
		switch (arrayName) {
			case ArrayName.BINDINGS:
				this.isClearBinding = true
				return this
			case ArrayName.CONTROLS:
				this.isClearControls = true
				return this
			case ArrayName.BUTTON_MAPPINGS:
				this.isClearButtonMappings = true
				return this
			case ArrayName.ANIMS:
				this.isClearAnims = true
				return this
			default:
				return arrayName satisfies never
		}
	}

	/**
	 * Remove all variables of this modfy element
	 * @returns
	 */
	clearVariables() {
		this.isClearVariables = true
		return this
	}

	/**
	 * Allows to modify the UI elements from resource packs below this one
	 * @returns
	 */
	addModifications(...modifications: ModificationItem[]) {
		this.modifications.push(...modifications)
		return this
	}

	insertBackChild<T extends Type, K extends Renderer | null>(
		child: UI<T, K>,
		properties?: Properties<T, K>,
		name?: string,
	) {
		if (this === <any>child) throw new Error("Cannot add a child to itself")
		if (!name) name = RandomString(16)

		return this.addModifications({
			array_name: ArrayName.CONTROLS,
			operation: Operation.INSERT_BACK,
			value: {
				[`${name}${child}`]: properties || {},
			},
		})
	}

	insertFrontChild<T extends Type, K extends Renderer | null>(
		child: UI<T, K>,
		properties?: Properties<T, K>,
		name?: string,
	) {
		if (this === <any>child) throw new Error("Cannot add a child to itself")
		if (!name) name = RandomString(16)

		return this.addModifications({
			array_name: ArrayName.CONTROLS,
			operation: Operation.INSERT_FRONT,
			value: [
				{
					[`${name}${child}`]: properties || {},
				},
			],
		})
	}

	insertAfterChild<T extends Type, K extends Renderer | null>(
		where: S,
		child: UI<T, K>,
		properties?: Properties<T, K>,
		name?: string,
	) {
		if (this === <any>child) throw new Error("Cannot add a child to itself")
		if (!name) name = RandomString(16)

		return this.addModifications({
			array_name: ArrayName.CONTROLS,
			operation: Operation.INSERT_AFTER,
			control_name: where!,
			value: {
				[`${name}${child}`]: properties || {},
			},
		})
	}

	insertBeforeChild<T extends Type, K extends Renderer | null>(
		where: S,
		child: UI<T, K>,
		properties?: Properties<T, K>,
		name?: string,
	) {
		if (this === <any>child) throw new Error("Cannot add a child to itself")
		if (!name) name = RandomString(16)

		return this.addModifications({
			array_name: ArrayName.CONTROLS,
			operation: Operation.INSERT_BEFORE,
			control_name: where!,
			value: {
				[`${name}${child}`]: properties || {},
			},
		})
	}

	insertChild<T extends Type, K extends Renderer | null>(
		child: UI<T, K>,
		properties?: Properties<T, K>,
		name?: string,
	) {
		return this.insertFrontChild(child, properties, name)
	}

	replaceChild<T extends Type, K extends Renderer | null>(where: S, child: UI<T, K>, properties?: Properties<T, K>) {
		return this.addModifications({
			array_name: ArrayName.CONTROLS,
			operation: Operation.REPLACE,
			control_name: where!,
			value: properties || {},
		})
	}

	/**
	 * Remove a child of this element
	 * @param name
	 * @returns
	 */
	removeChild(name: S) {
		return this.addModifications({
			array_name: ArrayName.CONTROLS,
			operation: Operation.REMOVE,
			control_name: name,
		})
	}

	insertBackBindings(...bindings: BindingItem[]) {
		return this.addModifications({
			array_name: ArrayName.BINDINGS,
			operation: Operation.INSERT_BACK,
			value: ResolveBinding(this.bindCache, ...bindings),
		})
	}

	insertFrontBindings(...bindings: BindingItem[]) {
		return this.addModifications({
			array_name: ArrayName.BINDINGS,
			operation: Operation.INSERT_FRONT,
			value: ResolveBinding(this.bindCache, ...bindings),
		})
	}

	insertBindings(...bindings: BindingItem[]) {
		return this.insertFrontBindings(...bindings)
	}

	/**
	 * Remove a binding of this element
	 * @param binding
	 */
	removeBinding(binding: BindingItem) {
		return this.addModifications({
			array_name: ArrayName.BINDINGS,
			operation: Operation.REMOVE,
			where: binding,
		})
	}

	insertBackButtonMappings(...buttonMappings: ButtonMapping[]) {
		return this.addModifications({
			array_name: ArrayName.BUTTON_MAPPINGS,
			operation: Operation.INSERT_BACK,
			value: buttonMappings,
		})
	}

	insertFrontButtonMappings(...buttonMappings: ButtonMapping[]) {
		return this.addModifications({
			array_name: ArrayName.BUTTON_MAPPINGS,
			operation: Operation.INSERT_FRONT,
			value: buttonMappings,
		})
	}

	insertButtonMappings(...buttonMappings: ButtonMapping[]) {
		return this.insertFrontButtonMappings(...buttonMappings)
	}

	/**
	 * Remove a button mapping of this element
	 * @param buttonMapping
	 * @returns
	 */
	removeButtonMapping(buttonMapping: ButtonMapping) {
		return this.addModifications({
			array_name: ArrayName.BUTTON_MAPPINGS,
			operation: Operation.REMOVE,
			where: buttonMapping,
		})
	}

	protected toJsonUIModify() {
		const obj = this.toJsonUI()

		if (this.isClearBinding) obj.bindings = []
		if (this.isClearControls) obj.controls = []
		if (this.isClearAnims) obj.anims = []
		if (this.isClearVariables) obj.variables = []
		if (this.isClearButtonMappings) obj.button_mappings = []

		if (this.modifications.length) {
			// const map = new Map<ArrayName, Map<string, unknown>>()

			// this.modifications.forEach(mod => {
			// 	const { operation, array_name, control_name, target, target_control, value, where } = mod

			// 	switch (array_name) {
			// 		case ArrayName.CONTROLS: {
			// 		}
			// 	}
			// })

			obj.modifications = this.modifications
		}

		return obj
	}

	protected toJSON() {
		const obj = this.toJsonUIModify()
		return obj
	}

	protected [util.inspect.custom]($: any, opts: any) {
		return `\x1b[33mUI\x1b[0m<\x1b[92mmodify\x1b[0m> \x1b[92m"${this}\x1b[92m"\x1b[0m ${util.inspect(this.toJsonUIModify(), opts)}\n`
	}
}
