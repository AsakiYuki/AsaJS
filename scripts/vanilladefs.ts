import fs from "fs"

const files: string[] = JSON.parse(fs.readFileSync("cache/ui_defs.json", "utf-8"))
const vanilla: NamespaceMap = new Map()

function readControls(namespace: string, file: string, elements: ElementMap, data: any[], prefix: string) {
	prefix += "/"

	const childs: string[] = []

	for (const element of data) {
		const [fullname, properties] = Object.entries(element)[0]

		const data: VanillaElement = {
			file,
			type: (<any>properties).type,
		}

		const [name, $2] = fullname.split("@")

		if (name.startsWith("$")) continue
		childs.push(name)

		if ($2 && !$2.startsWith("$")) {
			const [$3, $4] = $2.split(".")
			if ($4) {
				data.extend = {
					name: $4,
					namespace: $3,
				}
			} else {
				data.extend = {
					name: $3,
					namespace,
				}
			}
		}

		elements.set(prefix + name, data)

		const controls = (<any>properties).controls
		if (controls) {
			const childs = readControls(namespace, file, elements, controls, prefix + name)
			if (childs.length) data.children = childs
		}
	}

	return childs
}

function readData(namespace: string, file: string, elements: ElementMap, data: any) {
	for (const [fullname, properties] of Object.entries(data)) {
		const [name, $2] = fullname.split("@")
		const data: VanillaElement = {
			file,
			type: (<any>properties).type,
		}

		if ((<any>properties).anim_type) {
			data.anim_type = (<any>properties).anim_type
		}

		// Register element
		if ($2) {
			const [$3, $4] = $2.split(".")
			if ($4) {
				data.extend = {
					name: $4,
					namespace: $3,
				}
			} else {
				data.extend = {
					name: $3,
					namespace,
				}
			}
		}
		elements.set(name, data)

		const controls = (<any>properties).controls
		if (controls) {
			const childs = readControls(namespace, file, elements, controls, name)
			if (childs.length) data.children = childs
		}
	}
}

// Read
for (const file of files) {
	const { namespace, ...data } = JSON.parse(fs.readFileSync("cache/" + file, "utf-8"))

	let elements = vanilla.get(namespace)
	if (!elements) {
		elements = new Map<Namespace, VanillaElement>()
		vanilla.set(namespace, elements)
	}

	readData(namespace, file, elements, data)
}

// Format
function getActualType(name: string, namespace: string) {
	const e = vanilla.get(namespace)?.get(name)!

	if (e?.anim_type) return null

	if (e?.type) {
		return e.type
	} else {
		if (e?.extend) {
			return getActualType(e.extend.name, e.extend.namespace)
		}
	}
}

for (const [namespace, elements] of vanilla) {
	for (const [name, element] of elements) {
		if (element.extend) {
			const type = getActualType(element.extend.name, element.extend.namespace)
			if (type) {
				element.type = type
				elements.set(name, element)
			} else if (type === null) {
				vanilla.get(namespace)?.delete(name)
			}
		}
	}
}

for (const [namespace, elements] of vanilla) {
	for (const [name, element] of elements) {
		if (element.anim_type) {
			vanilla.get(namespace)?.delete(name)
		}
	}
}

const json: any = {}

for (const [namespace, elements] of vanilla) {
	json[namespace] ||= {}

	for (const [name, element] of elements) {
		element.type ||= "unknown"
		json[namespace][name] = element
	}
}

const prefix = `interface Element {
	file: string
	type: string
	children?: string[]
	extend?: {
		name: string
		namespace: string
	}
}

interface VanillaDefs {
	[key: string]: {
		[key: string]: Element
	}
}`

fs.writeFileSync("cache/vanilla-defs.json", JSON.stringify(json, null, 4))
fs.writeFileSync(
	"src/analyzer/vanilladefs.ts",
	`${prefix}\n\nexport const vanilladefs: VanillaDefs = ${JSON.stringify(json, null, 4)}`,
)

// Types
interface VanillaElement {
	extend?: {
		name: string
		namespace: string
	}
	anim_type?: string
	children?: string[]
	type: string
	file: string
}

type Name = string
type Namespace = string
type ElementMap = Map<Name, VanillaElement>
type NamespaceMap = Map<Namespace, ElementMap>
