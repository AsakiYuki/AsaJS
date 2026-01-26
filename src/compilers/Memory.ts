import { AnimationKeyframe } from "../components/AnimationKeyframe.js"
import { Class } from "../components/Class.js"
import { UI } from "../components/UI.js"
import { AnimType } from "../types/enums/AnimType.js"
import { Renderer } from "../types/enums/Renderer.js"
import { Type } from "../types/enums/Type.js"
import { isBuildMode } from "./Configuration.js"

type Element = UI<Type, Renderer | null> | AnimationKeyframe<AnimType>
interface FileInterface {
	namespace: string
	elements: Element[]
}
type Files = Map<string, FileInterface>

export class Memory extends Class {
	protected static files: Files = new Map<string, FileInterface>()

	public static add(element: UI<Type, Renderer | null> | AnimationKeyframe<AnimType>) {
		if (!isBuildMode) return
		let file = Memory.files.get(element.path)

		if (!file) {
			file = { namespace: element.namespace, elements: [] }
			Memory.files.set(element.path, file)
		}

		if (file.namespace === element.namespace) file.elements.push(element)
		else {
			console.error(`Namespace mismatch on ${element.name} (${element.namespace} !== ${file.namespace})`)
			process.exit(1)
		}
	}

	public static build() {
		const data: Map<string, any> = new Map()

		Memory.files.entries().forEach(([path, { elements, namespace }]) => {
			const record: Record<string, any> = {}

			elements.forEach(element => {
				record[element.name] = element
			})

			data.set(path, {
				namespace,
				...record,
			})
		})

		return data
	}
}
