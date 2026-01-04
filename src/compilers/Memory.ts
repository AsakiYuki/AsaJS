import { UI } from "../components/UI.js"

export const Memory = {
	cache: new Map<string, { namespace: string; elements: Map<string, UI<any>> }>(),

	register_ui(path: string, element: UI<any, any>) {
		const { elements: saver, namespace } = this.get_file(path, element.namespace!)

		if (saver.get(element.name!)) {
			console.error(`Element ${element.name} already exists in ${path}`)
			process.exit(1)
		}

		saver.set(element.name!, element)
		return namespace
	},

	get_file(path: string, namespace: string) {
		let cached = this.cache.get(path)

		if (!cached) {
			cached = { namespace, elements: new Map<string, UI<any>>() }
			this.cache.set(path, cached)
		}

		return cached
	},
}
