import { PFFS } from "../components"
import fs from "fs/promises"
import "../custom"

const schema = PFFS.readFileJSON("ui.schema.json").definitions

const enumPath = "src/types/enums/"

const index: string[] = []
for (const key in schema) {
	const data = schema[key]
	if (data.enum) {
		const enumName = key.match(/\w+$/)?.[0].toCamelCase(true)!
		console.log(enumName)
		index.push(`export { ${enumName} } from "./${enumName}.js"`)
		const count = new Map<string, number>()

		const fileData: string[] = [`export enum ${enumName} {`]

		for (const value of data.enum as string[]) {
			if (enumName === "ButtonId") {
				const values = value.match(/\w+/g)!
				const name =
					values[0] === "button" ? values.slice(1).join("_").toUpperCase() : values.join("_").toUpperCase()
				if (name === undefined) continue
				fileData.push(`    ${count.get(name) ? `${name}_${count.get(name)}` : name} = "${value}",`)

				count.set(name, (count.get(name) || 0) + 1)
			} else {
				let name = value.match(/\w+$/g)?.join("_")?.toUpperCase()!
				if (name === undefined) continue
				if (/\d/.test(name?.[0])) name = "_" + name
				fileData.push(`    ${count.get(name) ? `${name}_${count.get(name)}` : name} = "${value}",`)
				count.set(name, (count.get(name) || 0) + 1)
			}
		}

		if (enumName === "Type") {
			fileData.push(`    UNKNOWN = "unknown",`)
		}

		fileData.push("}")

		fs.writeFile(`${enumPath}${enumName}.ts`, fileData.join("\n"))
	}
}

fs.writeFile(`${enumPath}index.ts`, index.join("\n"))
