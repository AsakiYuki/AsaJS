import fs from "fs"
import path from "path"
import { parse } from "jsonc-parser"
import { uiFiles } from "./utils.js"

export function rebaseUIFiles(pack_folder: string) {
	const ui = uiFiles(pack_folder)
	const targetDir = path.join("custom", pack_folder)

	ui.add("ui/_ui_defs.json")
	ui.add("ui/_global_variables.json")

	if (!fs.existsSync(targetDir)) return

	for (const relativePath of ui) {
		const fullPath = path.join(targetDir, relativePath)

		if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
			try {
				const fileContent = fs.readFileSync(fullPath, "utf-8")
				const parsedData = parse(fileContent)

				if (parsedData !== undefined) {
					fs.writeFileSync(fullPath, JSON.stringify(parsedData, null, 4), "utf-8")
				}
			} catch (error) {
				console.error(`Parser error: ${fullPath}`, error)
			}
		}
	}
}
