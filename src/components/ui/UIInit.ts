import { FormatProperties } from "../../compiler/properties.js"
import { ResolveBinding } from "../../compiler/ui/resolve.js"
import { AnimType } from "../../types/ui/enums/AnimType.js"
import { Renderer } from "../../types/ui/enums/Renderer.js"
import { Type } from "../../types/ui/enums/Type.js"
import { Properties } from "../../types/ui/properties/components.js"
import { BindingItem, ButtonMapping, VariableItem, Variables } from "../../types/ui/properties/value.js"
import { GetRandomString } from "../../utils/Random.js"
import { Animation } from "./Animation.js"
import { AnimationKeyframe } from "./AnimationKeyframe.js"
import { FactoryManager } from "./Factory.js"

type ChildInput<C extends UIInit<Type, Renderer | null>> = {
	child: C
	properties?: C extends UIInit<infer T, infer K> ? Partial<Properties<T, K>> : never
	name?: string
	callback?: (name: string, parent: UIInit<Type, Renderer | null>) => void
}

export abstract class UIInit<T extends Type, R extends Renderer | null = null> {
	protected readonly controls = new Map<string, [UIInit<Type, Renderer | null>, Properties<Type, Renderer | null>]>()
	protected readonly bindings: BindingItem[] = []
	protected readonly variables: VariableItem[] = []
	protected readonly buttonMappings: ButtonMapping[] = []
	protected readonly anims: (Animation<AnimType> | AnimationKeyframe<AnimType>)[] = []
	protected readonly extendType?: Type
	protected factory?: FactoryManager
	protected properties: Properties<T, R> = <any>{}

	protected bindingCache = new Map<string, unknown>()

	constructor(
		protected readonly name: string,
		protected readonly file: string,
	) {}

	setProperties(properties: Properties<T, R>) {
		Object.assign(this.properties, properties)
	}

	setFactory(factory: FactoryManager) {
		this.factory = factory
	}

	addBindings(...bindings: BindingItem[]) {
		this.bindings.push(...ResolveBinding(this.bindingCache, ...bindings))
		return this
	}

	addVariables(variables: Variables) {
		Object.entries(variables).forEach(([key, value]) => {
			this.variables.push({
				requires: key,
				...value,
			})
		})

		return this
	}

	addButtonMappings(...mappings: ButtonMapping[]) {
		this.buttonMappings.push(...mappings)
		return this
	}

	addChild<T extends Type, K extends Renderer | null>(
		child: UIInit<T, K>,
		properties?: Properties<T, K>,
		name?: string,
		callback?: (name: string, parent: UIInit<T, K>) => void,
	) {
		if (this === <any>child) throw new Error("Cannot add a child to itself")
		const childName = name || GetRandomString()
		this.controls.set(childName, [child, properties || {}])
		callback?.(childName, <any>this)
		return this
	}

	addChilds<UIs extends readonly UIInit<Type, Renderer | null>[]>(
		...childs: { [K in keyof UIs]: ChildInput<UIs[K]> }
	) {
		const childrenList = childs as unknown as ChildInput<UIInit<Type, Renderer | null>>[]

		childrenList.forEach(({ child, properties, name, callback }) => {
			this.addChild(child, properties, name, callback)
		})

		return this
	}

	addAnimations(...anims: (Animation<AnimType> | AnimationKeyframe<AnimType>)[]) {
		this.anims.push(...anims)
		return this
	}

	protected build() {
		const obj: any = {
			...FormatProperties(this.properties),
		}

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

	abstract toString(): string
	abstract toJSON(): any
}
