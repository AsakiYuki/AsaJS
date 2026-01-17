import fs from "fs"

const data: any = JSON.parse(fs.readFileSync("cache/vanilla-defs.json", "utf-8"))

function toCamelCase(str: string) {
	return str.replace(/[-_]\w/g, m => m[1].toUpperCase())
}

const intelliSense: string[] = [
	'import { Type as T } from "../enums/Type.js"\n',
	"export type Namespace = keyof IntelliSense;",
	"export type Element<T extends Namespace> = IntelliSense[T]",
	"export type VanillaType<T extends Namespace, K extends Element<T>> = IntelliSense[T][K]\n",
	"export type IntelliSense = {",
]

const intelliSenseTypeEachNamespace: string[] = []

const paths: string[] = ["export const paths = {"]

for (const [namespace, element] of Object.entries(data)) {
	if (namespace === "undefined") continue
	const $namespace = toCamelCase("_" + namespace)

	const eType: string[] = [],
		eType3: string[] = [`export type ${$namespace}Type = {`],
		ePaths: string[] = [`    "${namespace}": {`]

	for (const [ePath, info] of Object.entries(<any>element)) {
		const { file, type, extend } = <any>info
		eType.push(`"${ePath}"`)
		eType3.push(`    "${ePath}": T.${type.toUpperCase()},`)
		ePaths.push(`        "${ePath}": "${file}",`)
	}

	eType3.push("}\n")
	ePaths.push("    },")

	paths.push(ePaths.join("\n"))
	intelliSense.push(`    "${namespace}": ${$namespace}Type,`)
	intelliSenseTypeEachNamespace.push(eType3.join("\n"))
}

intelliSense.push("}")

paths.push("}")

fs.writeFileSync(
	"src/types/vanilla/intellisense.ts",
	intelliSense.join("\n") + "\n\n" + intelliSenseTypeEachNamespace.join("\n"),
)
fs.writeFileSync("src/types/vanilla/paths.ts", paths.join("\n"))
