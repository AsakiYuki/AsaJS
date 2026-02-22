import { paths } from "../types/vanilla/paths.js"
import fs from "fs"
import path from "path"
import jsonc from "jsonc-parser"

export const vanilla_ui_defs = Object.values(paths)
const vanillaUIDefsMap = new Map<string, Set<string>>()

export function readUIDefs(pack_folder: string): string[] {
	const { ui_defs } = jsonc.parse(fs.readFileSync(path.join("custom", pack_folder, "ui/_ui_defs.json"), "utf-8"))
	return ui_defs
}

export function uiFiles(pack_folder: string): Set<string> {
	if (vanillaUIDefsMap.has(pack_folder)) return vanillaUIDefsMap.get(pack_folder)!
	const ui_defs = readUIDefs(pack_folder)
	const set = new Set(ui_defs.concat(...vanilla_ui_defs))
	vanillaUIDefsMap.set(pack_folder, set)
	return set
}
