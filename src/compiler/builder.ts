import { storage } from "./storage.js"
import fs from "fs/promises"
import path from "path"
import { Cache } from "./cache.js"

let isFirstRun = true
process.on("beforeExit", async () => {
	if (isFirstRun) {
		isFirstRun = false

		await Promise.all(
			Cache.get<string[]>("build_files").map(async file => {
				await fs.rm(path.resolve(file)).catch(() => {})
			}) || [],
		).then(v => {
			if (v.length) {
				console.log(`Removed ${v.length} build files.`)
			}
		})

		Cache.set(
			"build_files",
			await Promise.all(
				storage.entries().map(async ([file, builder]) => {
					const fullpath = path.resolve(file)
					const dirname = path.dirname(fullpath)
					await fs.stat(dirname).catch(async () => await fs.mkdir(dirname, { recursive: true }))
					await fs.writeFile(fullpath, builder.build())
					storage.delete(fullpath)
					return file
				}),
			),
		)

		await Cache.save()
	}
})
