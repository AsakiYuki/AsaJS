import { PFFS } from "./components"
import fs from "fs/promises"
import "./custom"

const schema = PFFS.readFileJSON("ui.schema.json").definitions

const enumPath = "src/types/enums/"

const index: string[] = []
const bagBindings = new Set(schema["hc:bag_binding"].enum)
for (const key in schema) {
	const data = schema[key]

	const ext = async (extendData: string[] = []) => {
		if (data.enum) {
			const enumName = key.match(/\w+$/)?.[0].toCamelCase(true)!
			index.push(`export { ${enumName} } from "./${enumName}.js"`)
			const count = new Map<string, number>()

			const fileData: string[] = [`export enum ${enumName} {`]

			for (const value of Array.from(new Set([...data.enum, ...extendData])) as string[]) {
				if (enumName === "ButtonId") {
					const values = value.match(/\w+/g)!
					const name =
						values[0] === "button"
							? values.slice(1).join("_").toUpperCase()
							: values.join("_").toUpperCase()
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

			await fs
				.writeFile(`${enumPath}${enumName}.ts`, fileData.join("\n"))
				.then(() => console.log(`Generated enum ${enumName} with ${data.enum.length} values`))
		}
	}

	await fs
		.readFile(`extends/${key.match(/\w+$/)?.[0]}.txt`, "utf-8")
		.then(async data => {
			const extendData = data.split("\r\n").filter(line => !bagBindings.has(line))
			await ext(extendData).then(v => console.log(`Extended ${key} with ${extendData.length} values`))
		})
		.catch(() => ext())
}

fs.writeFile(`${enumPath}index.ts`, index.join("\n"))
