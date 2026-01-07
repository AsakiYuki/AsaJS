import { UI } from "../components/UI.js"
import { Renderer } from "../types/enums/Renderer.js"
import { Type } from "../types/enums/Type.js"

export const Memory = {
	cache: new Map<string, { namespace: string; elements: Map<string, UI<Type, Renderer | null>> }>(),

	register_ui(path: string, element: UI<Type, Renderer | null>) {
		const { elements: saver, namespace } = this.get_file(path, element.namespace!)

		if (saver.get(element.name!)) {
			console.error(`Element ${element.name} already exists in ${path}`)
			process.exit(1)
		}

		saver.set(element.name!, element)
		return namespace
	},

	gen_ui_file_contents(namespace: string, elements: Map<string, UI<Type, Renderer | null>>) {
		return JSON.stringify(
			{
				namespace,
				...elements.toJSON(),
			},
			null,
			4
		)
	},

	get_file(path: string, namespace: string) {
		let cached = this.cache.get(path)

		if (!cached) {
			cached = { namespace, elements: new Map<string, UI<Type, Renderer | null>>() }
			this.cache.set(path, cached)
		}

		return cached
	},
}
