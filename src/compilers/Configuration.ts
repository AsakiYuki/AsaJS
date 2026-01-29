import fs from "fs"
import path from "path"
// @ts-ignore
import { Config } from "../../config.js"

if (!fs.existsSync("asajs.config.cjs")) {
	fs.copyFileSync("node_modules/asajs/resources/asajs.config.cjs", "asajs.config.cjs")
}

export const config: Config = require(path.resolve(process.cwd(), "asajs.config.cjs")).config

export let isBuildMode = config.compiler?.enabled ?? false
export let isLinkMode = config.compiler?.linked ?? false
export let unLinked = !(config.compiler?.linked ?? true)

for (const arg of process.argv) {
	if (arg === "--build") isBuildMode = true
	if (arg === "--link") isLinkMode = true
	else if (arg === "--unlink") unLinked = true
}
