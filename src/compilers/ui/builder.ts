import { config, isBuildMode, isLinkMode, unLinked } from "../Configuration.js"
import { Memory } from "../Memory.js"
import { createBuildFolder, linkToGame, unlink } from "./linker.js"
import { genManifest } from "./manifest.js"
import { UI } from "../../components/UI.js"
import { Type } from "../../types/enums/Type.js"
import fs from "fs/promises"
import { BuildCache } from "./buildcache.js"

async function buildUI() {
	const build = Memory.build()

	build.set("ui/_ui_defs.json", {
		ui_defs: Array.from(build.keys()),
	})

	if (config.global_variables) build.set("ui/_global_variables.json", config.global_variables)

	const out = await Promise.all(
		build.entries().map(async ([file, value]) => {
			const outFile = `build/${file}`
			await fs
				.stat(outFile.split(/\\|\//g).slice(0, -1).join("/"))
				.catch(async () => await fs.mkdir(outFile.split(/\\|\//g).slice(0, -1).join("/"), { recursive: true }))

			await fs.writeFile(
				outFile,
				JSON.stringify(
					Object.fromEntries(
						Object.entries(value).map(([key, value]: [string, any]) => {
							const extend = (value as UI<Type>).extend
							return [extend ? key + String(extend) : key, value]
						}),
					),
				),
				"utf-8",
			)
			build.delete(file)
			return file
		}),
	)

	await Promise.all([
		fs.writeFile("build/manifest.json", await genManifest(), "utf-8"),
		fs.writeFile("build/.gitignore", [...out, "manifest.json"].join("\n"), "utf-8"),
		BuildCache.set("build-files", [...out, "manifest.json"]),
		fs
			.stat("build/pack_icon.png")
			.catch(() => fs.copyFile("node_modules/asajs/resources/pack_icon.png", "build/pack_icon.png")),
	])

	return out.length
}

if (isBuildMode) {
	let first = true
	process.on("beforeExit", async () => {
		if (first) {
			await createBuildFolder()
			await buildUI()
			if (isLinkMode) await linkToGame()
		}
		first = false
	})
} else if (isLinkMode) linkToGame()
else if (unLinked) unlink()
