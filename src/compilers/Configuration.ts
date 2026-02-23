import fs from "fs"
import path from "path"
import jsonc from "jsonc-parser"
import { Config, RetBindingValue } from "../../config.js"
import { createRequire } from "module"
import { rebaseUIFiles } from "../analyzer/rebaseUIFiles.js"
import { generateUIDefs } from "../analyzer/generate-ui-defs.js"
import { genCustomCode } from "../analyzer/generate-code.js"

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

				fs.readFileSync("resources/example-config.js", "utf-8").replace("asajs/", "./"),
			].join("\n"),
		)
	} else {
		fs.writeFileSync(
			"asajs.config.js",
			[
				'import { RandomBindingString } from "asajs"\n',
				fs.readFileSync(path.join(process.cwd(), "node_modules/asajs/resources/example-config.js"), "utf-8"),
			].join("\n"),
		)
	}
}

export const config: Config = createRequire(import.meta.url)(path.resolve(process.cwd(), "asajs.config.js")).config

export const isBuildMode = options["build"] ?? config.compiler?.enabled ?? false
export const isLinkMode = options["link"] ?? config.compiler?.autoImport ?? false
export const unLinked = options["unlink"] ?? !(config.compiler?.autoImport ?? true)
export const buildFolder = config.compiler?.buildFolder || "build"
export const uiBuildFolder = config.compiler?.uiBuildFolder || "asajs"

export const bindingFuntions = config.binding_functions

if (!fs.existsSync(".gitignore")) {
	fs.writeFileSync(".gitignore", "node_modules\ncustom", "utf-8")
}

if (config.ui_analyzer?.enabled) {
	config.ui_analyzer.imports?.forEach(v => {
		if (!fs.existsSync(path.join(config.ui_analyzer?.generate_path || "database", `${v}.ts`))) {
			if (!fs.existsSync(path.join("database", `${v}-defs.json`))) {
				if (fs.existsSync(path.join("custom", v, "ui/_ui_defs.json"))) {
					rebaseUIFiles(v)
					generateUIDefs(v)
				} else throw new Error(`${v} ui_defs.json not found`)
			}

			genCustomCode(v)
		}
	})
}
