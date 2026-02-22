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

	const processDirectory = (currentDir: string) => {
		const entries = fs.readdirSync(currentDir, { withFileTypes: true })

		for (const entry of entries) {
			const fullPath = path.join(currentDir, entry.name)

			if (entry.isDirectory()) {
				processDirectory(fullPath)

				if (fs.readdirSync(fullPath).length === 0) {
					fs.rmdirSync(fullPath)
				}
			} else if (entry.isFile()) {
				const relativePath = fullPath.replace(targetDir + path.sep, "")
				const normalizedPath = relativePath.split(path.sep).join("/")

				if (!ui.has(normalizedPath)) {
					fs.rmSync(fullPath, { force: true })
				} else {
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
	}

	processDirectory(targetDir)
}
