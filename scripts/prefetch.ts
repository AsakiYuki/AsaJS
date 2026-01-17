import { Github, PFFS } from "./components"
import { parse } from "jsonc-parser"

const user = "mojang"
const project = "bedrock-samples"
const branches = process.argv.includes("--preview") ? "preview" : "main"

async function fetchfile(path: string) {
	return parse(await Github.readFile(user, project, branches, path))
}

async function main() {
	console.log("Prefetching...")
	const data = await Github.readFile("KalmeMarq", "Bugrock-JSON-UI-Schemas", "main", "ui.schema.json")
	await PFFS.writeFile("ui.schema.json", data)
	console.log("ui.schema.json fetched!")

	const { ui_defs } = await fetchfile("resource_pack/ui/_ui_defs.json")
	await PFFS.writeFile("ui_defs.json", JSON.stringify(ui_defs, null, 2))
	console.log("ui_defs.json fetched!")

	let fetched = 0
	await Promise.all(
		ui_defs.map(async (path: string) => {
			const data = await fetchfile("resource_pack/" + path)
			await PFFS.writeFile(path, JSON.stringify(data, null, 2))
			console.log(`[${++fetched}/${ui_defs.length}] ${path}`)
		}),
	)
}

main()
