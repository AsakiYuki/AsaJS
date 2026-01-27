import { isBuildMode } from "../Configuration.js"
import { Memory } from "../Memory.js"
import { createBuildFolder } from "./linker.js"
import fs from "fs/promises"

async function buildUI() {
	const build = Memory.build()
	let i = 0

	build.set("ui/ui_defs.json", {
		ui_defs: Array.from(build.keys()),
	})

	await Promise.all(
		build.entries().map(async ([file, value]) => {
			const outFile = `build/build/${file}`
			await fs
				.stat(outFile.split(/\\|\//g).slice(0, -1).join("/"))
				.catch(async () => await fs.mkdir(outFile.split(/\\|\//g).slice(0, -1).join("/"), { recursive: true }))

			await fs.writeFile(outFile, JSON.stringify(value), "utf-8")
			i++
		}),
	)

	return i - 1
}

if (isBuildMode) {
	let first = true
	process.on("beforeExit", async () => {
		if (first) {
			await createBuildFolder()
			await buildUI()
		}
		first = false
	})
}
