import { config, isBuildMode, isLinkMode, unLinked } from "../Configuration.js"
import { Memory } from "../Memory.js"
import { createBuildFolder, gamePath, getBuildFolderName, linkToGame, unlink } from "./linker.js"
import { genManifest, version } from "./manifest.js"
import { UI } from "../../components/UI.js"
import { Type } from "../../types/enums/Type.js"
import fs from "fs/promises"
import { BuildCache } from "./buildcache.js"
import { disableRSP, enableRSP } from "./installer.js"
import { Log } from "../PreCompile.js"
import path from "path"

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

			await fs
				.writeFile(
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
				.then(() => Log("INFO", `${outFile} with ${Object.keys(value).length} elements created!`))
			build.delete(file)
			return file
		}),
	)

	await Promise.all([
		fs
			.writeFile("build/manifest.json", await genManifest(), "utf-8")
			.then(() => Log("INFO", "build/manifest.json created!")),
		fs
			.writeFile("build/.gitignore", [...out, "manifest.json"].join("\n"), "utf-8")
			.then(() => Log("INFO", "build/.gitignore created!")),
		BuildCache.set("build-files", [...out, "manifest.json"]).then(() => Log("INFO", "build-files set!")),
		BuildCache.set("version", version).then(() => Log("INFO", "version set!")),
		fs
			.stat("build/pack_icon.png")
			.catch(() => fs.copyFile("node_modules/asajs/resources/pack_icon.png", "build/pack_icon.png"))
			.then(() => Log("INFO", "build/pack_icon.png copied!")),
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
			if (config.compiler?.autoEnable) await enableRSP()
			else await disableRSP()
			Log("INFO", "Build completed!")
			console.log("========================= PACK INFO =========================")
			console.log("Name:", `\x1b[32m${config.packinfo?.name || "MyPack"}\x1b[0m`)
			console.log(
				"Description:",
				`\x1b[32m${config.packinfo?.description || "Create your Minecraft JSON-UI resource packs using JavaScript."}\x1b[0m`,
			)
			console.log("Version:", config.packinfo?.version || [4, 0, 0])
			console.log("UUID:", await BuildCache.get<[string, string]>("uuid"))
			if (gamePath)
				console.log("Install Path:", `\x1b[32m"${path.join(gamePath, await getBuildFolderName())}"\x1b[0m`)
			console.log("=============================================================")
		}
		first = false
	})
} else if (isLinkMode) linkToGame()
else if (unLinked) unlink()
