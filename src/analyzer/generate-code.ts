import path from "node:path"
import fs from "fs"
import { config } from "../compilers/Configuration.js"
import { Type } from "../types/enums/Type.js"

interface Element {
	file: string
	type: string
	extends?: {
		name: string
		namespace: string
	}
	children?: string[]
}

interface Database {
	[key: string]: Element
}

const importType = 'import { Type, MemoryModify, ModifyUI } from "asajs"'

function toCamelCase(str: string) {
	return str.replace(/[-_]\w/g, m => m[1].toUpperCase())
}

export function genCustomCode(pack_folder: string) {
	const database = JSON.parse(fs.readFileSync(path.join("database", `${pack_folder}-defs.json`), "utf-8"))
	const Elements: string[] = []
	const json: Record<string, Record<string, string>> = {}
	const UI = [
		"type UI = {",
		...Object.entries(database).map(args => {
			const [key, element] = <[string, Database]>args
			const typeName = `${key[0].toUpperCase()}${toCamelCase(key).slice(1)}`
			const filepaths: Record<string, string> = {}
			Elements.push(
				[
					`type ${typeName} = {`,
					...Object.entries(element).map(([elementPath, elementData]) => {
						filepaths[elementPath] = elementData.file
						const type = elementData.type.toUpperCase()
						// @ts-ignore
						return `    "${elementPath}": {\n        type: Type.${Type[type] ? type : "PANEL"},\n        children: ${elementData.children ? elementData.children.map(c => `"${c}"`).join(" | ") : "string"}\n    },`
					}),
					"}",
				].join("\n"),
			)
			json[key] = {
				...(json[key] || {}),
				...filepaths,
			}
			return `    "${key}": ${typeName},`
		}),
		"}",
	].join("\n")

	const paths = `const paths = ${JSON.stringify(json, null, 4)}`

	if (config.ui_analyzer?.generate_path) {
		if (!fs.existsSync(config.ui_analyzer?.generate_path)) {
			fs.mkdirSync(config.ui_analyzer?.generate_path, { recursive: true })
		}
	}

	fs.writeFileSync(
		path.join(config.ui_analyzer?.generate_path || "database", `${pack_folder}.ts`),
		[
			importType,
			`type Namespace = keyof UI
type Element<T extends Namespace> = Extract<keyof UI[T], string>
type ElementInfos<T extends Namespace, K extends Element<T>> = UI[T][K]
// @ts-ignore
type GetType<T extends Namespace, K extends Element<T>> = ElementInfos<T, K>["type"]
// @ts-ignore
type GetChilds<T extends Namespace, K extends Element<T>> = ElementInfos<T, K>["children"]

export default function Modify<T extends Namespace, K extends Element<T>>(namespace: T, name: K) {
	// @ts-ignore
	const getPath = paths[namespace][name]
	// @ts-ignore
	const memoryUI = MemoryModify[getPath]?.[name]
	// @ts-ignore
	if (memoryUI) return memoryUI as ModifyUI<GetType<T, K>, GetChilds<T, K>>
	const path = paths[namespace]
	if (!path) {
		throw new Error(\`Namespace '\${namespace}' does not exist\`)
		// @ts-ignore
	} else if (typeof path !== "string" && !getPath) {
		throw new Error(\`Element '\${name}' does not exist in namespace '\${namespace}'\`)
	}
	// @ts-ignore
	const modifyUI = new ModifyUI<GetType<T, K>, GetChilds<T, K>>(
		namespace,
		name,
		// @ts-ignore
		typeof path === "string" ? path : getPath,
	)
	// @ts-ignore
	;(MemoryModify[getPath] ||= {})[name] = modifyUI
	return modifyUI
}`,
			paths,
			UI,
			...Elements,
		].join("\n\n"),
		"utf-8",
	)
}
