import fs from "fs"
import path from "path"
import jsonc from "jsonc-parser"
import { Config, RetBindingValue } from "../../config.js"
import { createRequire } from "module"

const options: Record<string, unknown> = {}

for (const arg of process.argv) {
	if (arg.startsWith("--")) options[arg.slice(2)] = true
}

export let isTestMode = false
try {
	const { name } = jsonc.parse(fs.readFileSync(path.resolve("package.json"), "utf-8"))
	if (name === "asajs") isTestMode = true
} catch (error) {}

if (!fs.existsSync("asajs.config.js")) {
	if (isTestMode) {
		fs.writeFileSync(
			"asajs.config.js",
			[
				`export function RandomBindingString(length, base = 32) {
	const chars = "0123456789abcdefghijklmnopqrstuvwxyz".slice(0, base)
	const out = new Array()
				
	try {
		const buffer = new Uint8Array(length)
		crypto.getRandomValues(buffer)
		for (let i = 0; i < length; i++) {
			out[i] = chars[buffer[i] % base]
		}
	} catch {
		for (let i = 0; i < length; i++) {
			out[i] = chars[Math.floor(Math.random() * base)]
		}
	}
				
	return \`#$\{out.join("")}\`
}\n`,

				fs.readFileSync("resources/asajs.config.js", "utf-8").replace("asajs/", "./"),
			].join("\n"),
		)
	} else {
		fs.writeFileSync(
			"asajs.config.js",
			[
				'import { RandomBindingString } from "asajs"\n',
				fs.readFileSync("node_modules/asajs/resources/asajs.config.js", "utf-8"),
			].join("\n"),
		)
	}
}

export const config: Config = createRequire(import.meta.url)(path.resolve(process.cwd(), "asajs.config.js")).config

export const isBuildMode = options["build"] ?? config.compiler?.enabled ?? false
export const isLinkMode = options["link"] ?? config.compiler?.autoImport ?? false
export const unLinked = options["unlink"] ?? !(config.compiler?.autoImport ?? true)
export const buildFolder = config.compiler?.buildFolder || "build"

export const bindingFuntions = config.binding_functions

if (!fs.existsSync(".gitignore")) {
	fs.writeFileSync(".gitignore", `node_modules`, "utf-8")
}
