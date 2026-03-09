import { Type } from "../../types/ui/enums/Type.js"
import { Variable } from "../../types/ui/properties/value.js"
import { UI } from "./UI.js"

export class FactoryManager {
	private maxChildrenSize?: number
	private factoryVariables?: Array<Variable>
	private controlIds: Map<string, UI<Type>>
	private control?: UI<Type>

	constructor(protected name: string) {
		this.controlIds = new Map()
	}

	setControlId(name: string, element: UI<Type>) {
		if (this.control) throw new Error("Cannot set control id after setting control")
		this.controlIds.set(name, element)
		return this
	}

	setControlIds(...elements: { name: string; element: UI<Type> }[]) {
		elements.forEach(({ name, element }) => this.controlIds.set(name, element))
		return this
	}

	setControl(element: UI<Type>) {
		if (this.controlIds.size) throw new Error("Cannot set control after setting control ids")
		this.control = element
		return this
	}

	setMaxChildrenSize(size: number) {
		this.maxChildrenSize = size
		return this
	}

	protected toJSON() {
		const obj: any = { name: this.name }

		if (this.maxChildrenSize) obj.max_children_size = this.maxChildrenSize
		if (this.factoryVariables) obj.variables = this.factoryVariables
		if (this.control) obj.control_name = this.control.toString().slice(1)
		if (this.controlIds.size) {
			const controlIds: Record<string, string> = {}
			this.controlIds.forEach((value, key) => (controlIds[key] = key + value.toString()))
			obj.control_ids = controlIds
		}

		return obj
	}
}
