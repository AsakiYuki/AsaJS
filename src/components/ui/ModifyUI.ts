import { GetModifyStorage } from "../../compiler/ui/modifystorage.js"
import { ResolveBinding } from "../../compiler/ui/resolve.js"
import { ArrayName } from "../../types/ui/enums/ArrayName.js"
import { Operation } from "../../types/ui/enums/Operation.js"
import { Renderer } from "../../types/ui/enums/Renderer.js"
import { Type } from "../../types/ui/enums/Type.js"
import { Properties } from "../../types/ui/properties/components.js"
import { BindingItem, ButtonMapping, ModificationItem } from "../../types/ui/properties/value.js"
import { GetRandomString } from "../../utils/Random.js"
import { UIInit } from "./UIInit.js"

export class ModifyUI<T extends Type, R extends Renderer | null = null, S extends string = string> extends UIInit<
	T,
	R
> {
	private isClearBinding: boolean = false
	private isClearVariables: boolean = false
	private isClearControls: boolean = false
	private isClearAnims: boolean = false
	private isClearButtonMappings: boolean = false

	protected modifications: ModificationItem[] = []

	constructor(
		protected readonly namespace: string,
		name: string,
		file: string,
	) {
		super(name, file)
		GetModifyStorage(this.file).add(this.name, this)
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
		child: UIInit<T, K>,
		properties?: Properties<T, K>,
		name?: string,
	) {
		if (this === <any>child) throw new Error("Cannot add a child to itself")
		if (!name) name = GetRandomString()

		return this.addModifications({
			array_name: ArrayName.CONTROLS,
			operation: Operation.INSERT_BACK,
			value: {
				[`${name}${child}`]: properties || {},
			},
		})
	}

	insertFrontChild<T extends Type, K extends Renderer | null>(
		child: UIInit<T, K>,
		properties?: Properties<T, K>,
		name?: string,
	) {
		if (this === <any>child) throw new Error("Cannot add a child to itself")
		if (!name) name = GetRandomString()

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
		child: UIInit<T, K>,
		properties?: Properties<T, K>,
		name?: string,
	) {
		if (this === <any>child) throw new Error("Cannot add a child to itself")
		if (!name) name = GetRandomString()

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
		child: UIInit<T, K>,
		properties?: Properties<T, K>,
		name?: string,
	) {
		if (this === <any>child) throw new Error("Cannot add a child to itself")
		if (!name) name = GetRandomString()

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
		child: UIInit<T, K>,
		properties?: Properties<T, K>,
		name?: string,
	) {
		return this.insertFrontChild(child, properties, name)
	}

	replaceChild<T extends Type, K extends Renderer | null>(
		where: S,
		child: UIInit<T, K>,
		properties?: Properties<T, K>,
	) {
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
			value: ResolveBinding(this.bindingCache, ...bindings),
		})
	}

	insertFrontBindings(...bindings: BindingItem[]) {
		return this.addModifications({
			array_name: ArrayName.BINDINGS,
			operation: Operation.INSERT_FRONT,
			value: ResolveBinding(this.bindingCache, ...bindings),
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

	protected buildModify() {
		const obj = this.build()

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

	toString(): string {
		return `@${this.namespace}.${this.name}`
	}

	toJSON() {
		return this.buildModify()
	}
}
