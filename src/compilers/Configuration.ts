import fs from "fs"
import path from "path"
// @ts-ignore
import { Config } from "../../config.js"
import { createRequire } from "module"

const options: Record<string, unknown> = {}

for (const arg of process.argv) {
	if (arg.startsWith("--")) options[arg.slice(2)] = true
}

export const isTestMode = options["test"] ?? false

if (!fs.existsSync("asajs.config.js")) {
	if (isTestMode) {
		fs.writeFileSync(
			"asajs.config.js",
			fs.readFileSync("resources/asajs.config.js", "utf-8").replace("asajs/", "./"),
		)
	} else {
		fs.copyFileSync("node_modules/asajs/resources/asajs.config.js", "asajs.config.js")
	}
}

export const config: Config = createRequire(import.meta.url)(path.resolve(process.cwd(), "asajs.config.js")).config

export const isBuildMode = options["build"] ?? config.compiler?.enabled ?? false
export const isLinkMode = options["link"] ?? config.compiler?.autoImport ?? false
export const unLinked = options["unlink"] ?? !(config.compiler?.autoImport ?? true)

if (!fs.existsSync(".gitignore")) {
	fs.writeFileSync(".gitignore", `node_modules`, "utf-8")
}
