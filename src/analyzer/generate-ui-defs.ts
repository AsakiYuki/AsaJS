import path from "path"
import { uiFiles } from "./utils.js"
import fs from "fs"
import { paths } from "../types/vanilla/paths.js"
import { vanilladefs } from "./vanilladefs.js"

type Namespace = string
type ElementPath = string

interface ScanElement {
	file: string
	type?: string
	extends?: {
		name: string
		namespace?: string
	}
	children?: string[]
}

const map = new Map<string, Namespace>()
Object.entries(paths).forEach(([namespace, path]) => {
	map.set(path, namespace)
})

export function generateUIDefs(pack_folder: string) {
	const uiMap = new Map<Namespace, Map<ElementPath, ScanElement>>()
	uiFiles(pack_folder).forEach(file => {
		try {
			const fileContent: Record<string, unknown> = JSON.parse(
				fs.readFileSync(path.join("custom", pack_folder, file), "utf-8"),
			)
			if (fileContent["file_signature"]) delete fileContent["file_signature"]

			let n = fileContent["namespace"]
			if (n) delete fileContent["namespace"]
			else n = map.get(file)
			const namespace = <string>n

			const elementMap = new Map<ElementPath, ScanElement>()

			function scanElement(elements: Array<[string, any]>, prefix: string = "") {
				const childElement: string[] = []
				elements.forEach(([element, properties]: [string, any]) => {
					if (properties.anim_type) return

					const [name, extend] = element.split("@")
					if (name.startsWith("$")) return
					if (name.startsWith("$")) return
					childElement.push(name)
					const elementPath = `${prefix}${name}`
					let extendsName: string | undefined
					let extendsNamespace: string | undefined
					if (extend) {
						const [extnamespace, name] = extend.split(".")
						if (name) {
							extendsName = name
							extendsNamespace = extnamespace
						} else {
							extendsName = extnamespace
							extendsNamespace = namespace
						}
					}

					const controls = properties.controls
					const out: any = {
						file,
					}

					if (controls) {
						const children = scanElement(
							controls.map((c: string) => Object.entries(c)[0]),
							`${prefix}${name}/`,
						)

						if (children.length) out.children = children
					}

					if (properties.type) out.type = properties.type
					if (extendsName && extendsNamespace)
						out.extends = { name: extendsName, namespace: extendsNamespace }

					elementMap.set(elementPath, out)
				})
				return childElement
			}
			scanElement(Object.entries(fileContent))
			uiMap.set(namespace, elementMap)
		} catch (error) {}
	})

	function scanElementType(name: string, namespace: string) {
		const element = uiMap.get(namespace)?.get(name)
		if (element) {
			if (element.type) return element.type
			else {
				const extend = element.extends
				if (extend) return scanElementType(extend.name, extend.namespace!)
			}
		}
		return vanilladefs[namespace]?.[name]?.type
	}

	uiMap.entries().forEach(([namespace, elementsMap]) => {
		elementsMap.entries().forEach(([name, { file, type, extends: extend }]) => {
			if (type) return
			else {
				if (extend) {
					const type = scanElementType(extend.name, extend.namespace!)
					if (type) {
						elementsMap.set(name, {
							...elementsMap.get(name)!,
							type,
						})
					} else elementsMap.delete(name)
				} else {
					const elementDefs = vanilladefs[namespace]?.[name]
					if (elementDefs) {
						elementsMap.set(name, {
							...elementsMap.get(name)!,
							type: elementDefs.type,
						})
					} else {
						elementsMap.delete(name)
					}
				}
			}
		})

		if (!elementsMap.size) uiMap.delete(namespace)
	})

	if (!fs.existsSync("database")) fs.mkdirSync("database")
	fs.writeFileSync(path.join("database", `${pack_folder}-defs.json`), JSON.stringify(uiMap, null, 4), "utf-8")
}
