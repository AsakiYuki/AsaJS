import fs from "fs"

const data: any = JSON.parse(fs.readFileSync("cache/vanilla-defs.json", "utf-8"))

function toCamelCase(str: string) {
	return str.replace(/[-_]\w/g, m => m[1].toUpperCase())
}

const type: string[] = []
const $$namespace: string[] = []

const intelliSense: string[] = ['import * as mc from "./elements.js"\n', "export type IntelliSense = {"]

for (const [namespace, element] of Object.entries(data)) {
	if (namespace === "undefined") continue
	$$namespace.push(`"${namespace}"`)
	const $namespace = toCamelCase("_" + namespace)

	const eType: string[] = []
	for (const [ePath, info] of Object.entries(<any>element)) {
		const { file, type, extend } = <any>info
		eType.push(`"${ePath}"`)
	}

	intelliSense.push(`    "${namespace}": mc.${$namespace},`)

	type.push(`export type ${$namespace} = ${eType.join(" | ")};`)
}

intelliSense.push("}")

fs.writeFileSync(
	"src/types/vanilla/elements.ts",
	`export type Namespace = ${$$namespace.join(" | ")}\n\n` + type.join("\n"),
)

fs.writeFileSync("src/types/vanilla/intellisense.ts", intelliSense.join("\n"))
