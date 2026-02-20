import os from "os"
import path from "path"
import fs from "fs"
import fsp from "fs/promises"
import { config } from "../Configuration.js"
import { BuildCache } from "./buildcache.js"
import { version } from "./manifest.js"
import { Log } from "../PreCompile.js"

interface PackInfo {
	pack_id: string
	subpack?: string
	version: [number, number, number]
}

export interface PathInfo<Platform = NodeJS.Platform> {
	os: Platform
	isGdk: Platform extends "win32" ? boolean : never
	gamepath: string | null
}

export const pathinfo: PathInfo = {
	os: os.platform(),
	isGdk: false,
	gamepath: null,
}

function getGlobalResourcePackFile(gamepath: string) {
	return path.join(gamepath, "minecraftpe/global_resource_packs.json")
}

async function readGlobalRspFile(filepath: string) {
	try {
		if (await fsp.stat(filepath)) {
			return JSON.parse(await fsp.readFile(filepath, "utf-8")) as PackInfo[]
		}
	} catch (error) {
		return null
	}
}

async function writeGlobalRspFile(filepath: string, data: PackInfo[]) {
	try {
		await fsp.writeFile(filepath, JSON.stringify(data), "utf-8")
	} catch (error) {
		return null
	}
}

export async function enable(uuid: string, version: [number, number, number], filepath: string) {
	try {
		const globalRsp = await readGlobalRspFile(filepath)
		if (!globalRsp) return null
		const index = globalRsp.findIndex(data => data.pack_id === uuid)
		if (index === -1) {
			globalRsp.push({ pack_id: uuid, version })
			await writeGlobalRspFile(filepath, globalRsp)
			return true
		} else if (globalRsp[index].version.join(".") !== version.join(".")) {
			globalRsp[index].version = version
			await writeGlobalRspFile(filepath, globalRsp)
			return true
		}
		return false
	} catch (error) {
		return null
	}
}

export async function disable(uuid: string, filepath: string) {
	try {
		let globalRsp = await readGlobalRspFile(filepath)
		if (!globalRsp) return null
		let isWrite = false
		globalRsp = globalRsp.filter(data => {
			if (data.pack_id === uuid) isWrite = true
			return data.pack_id !== uuid
		})
		if (isWrite) {
			await writeGlobalRspFile(filepath, globalRsp)
			return true
		} else return false
	} catch (error) {
		return null
	}
}

export async function enableRSP() {
	if (pathinfo.isGdk && pathinfo.gamepath) {
		const ids: string[] = [],
			gamepath = path.join(pathinfo.gamepath, "../../..")
		if (config.compiler?.gdkUserId && /^\d+$/.test(config.compiler.gdkUserId)) ids.push(config.compiler.gdkUserId)
		else
			ids.push(...(await fsp.readdir(gamepath, { withFileTypes: false })).filter((id: string) => id !== "Shared"))

		const [uuid] = await Promise.all([BuildCache.get<[string, string]>("uuid")])

		if (!uuid) return
		await Promise.all(
			ids.map(async (id: string) =>
				enable(uuid[0]!, version, getGlobalResourcePackFile(path.join(gamepath, id, "games/com.mojang"))).then(
					v => {
						if (v) {
							Log("INFO", "Resource Pack enabled automaticly for " + id)
						}
					},
				),
			),
		)
	} else if (pathinfo.gamepath) {
		const [uuid] = await Promise.all([BuildCache.get<[string, string]>("uuid")])
		if (!uuid) return
		await enable(uuid[0]!, version, getGlobalResourcePackFile(pathinfo.gamepath)).then(v => {
			if (v) {
				Log("INFO", "Resource Pack enabled automaticly")
			}
		})
	}
}

export async function disableRSP() {
	if (pathinfo.isGdk && pathinfo.gamepath) {
		const gamepath = path.join(pathinfo.gamepath, "../../..")
		const [uuid] = await Promise.all([BuildCache.get<[string, string]>("uuid")])
		if (!uuid) return
		await Promise.all(
			(await fsp.readdir(gamepath, { withFileTypes: false })).map(async (id: string) =>
				disable(uuid[0]!, getGlobalResourcePackFile(path.join(gamepath, id, "games/com.mojang"))).then(v => {
					if (v) {
						Log("INFO", "Resource Pack disabled automaticly for " + id)
					}
				}),
			),
		)
	} else if (pathinfo.gamepath) {
		const [uuid] = await Promise.all([BuildCache.get<[string, string]>("uuid")])
		if (!uuid) return
		await disable(uuid[0]!, getGlobalResourcePackFile(pathinfo.gamepath)).then(v => {
			if (v) {
				Log("INFO", "Resource Pack disabled automaticly")
			}
		})
	}
}

export function getGamedataPath() {
	switch (pathinfo.os) {
		case "win32": {
			if (/Windows (10|11)/.test(os.version())) {
				let gamedata = path.join(
					process.env.APPDATA!,
					config.compiler?.importToPreview ? "Minecraft Bedrock Preview" : "Minecraft Bedrock",
					"\\Users\\Shared\\games\\com.mojang",
				)

				if (fs.existsSync(gamedata)) {
					pathinfo.isGdk = true
					return (pathinfo.gamepath = gamedata)
				}

				gamedata = path.join(
					process.env.LOCALAPPDATA!,
					"Packages",
					config.compiler?.importToPreview
						? "Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe"
						: "Microsoft.MinecraftUWP_8wekyb3d8bbwe",
					"LocalState\\games\\com.mojang",
				)

				if (fs.existsSync(gamedata)) {
					return (pathinfo.gamepath = gamedata)
				}
			}
		}

		case "linux": {
			const gamedata = path.join(process.env.HOME!, "\\.local\\share\\mcpelauncher\\games\\com.mojang")
			if (fs.existsSync(gamedata)) return (pathinfo.gamepath = gamedata)
			else {
				return (pathinfo.gamepath = path.join(
					process.env.HOME!,
					"\\.var\\app\\io.mrarm.mcpelauncher\\data\\mcpelauncher\\games\\com.mojang",
				))
			}
		}

		default: {
			console.warn(`Your platform is not supported the install feature yet! \nYour OS version: ${os.version()}`)
		}
	}
}
