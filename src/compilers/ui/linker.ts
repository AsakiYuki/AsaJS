import fs from "fs/promises"
import { BuildCache } from "./buildcache.js"
import { RandomString } from "../../components/Utils.js"
import path from "path"
import { getGamedataPath, PathInfo, pathinfo } from "./installer.js"
import { Log } from "../PreCompile.js"

const HEX: string[] = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"))

function genUUID(): string {
	const b = Array.from({ length: 16 }, () => Math.floor(Math.random() * 256))

	// version 4
	b[6] = (b[6] & 0x0f) | 0x40
	// variant 10xx
	b[8] = (b[8] & 0x3f) | 0x80

	return (
		`${HEX[b[0]]}${HEX[b[1]]}${HEX[b[2]]}${HEX[b[3]]}-` +
		`${HEX[b[4]]}${HEX[b[5]]}-` +
		`${HEX[b[6]]}${HEX[b[7]]}-` +
		`${HEX[b[8]]}${HEX[b[9]]}-` +
		`${HEX[b[10]]}${HEX[b[11]]}${HEX[b[12]]}${HEX[b[13]]}${HEX[b[14]]}${HEX[b[15]]}`
	)
}

export async function clearBuild() {
	const files: string[] = (await BuildCache.get("build-files")) || []
	await Promise.all(files.map(file => fs.rm(`build/${file}`).catch(() => null))).then(() => {
		if (files.length) {
			Log("INFO", `Build folder cleared (${files.length} files removed)!`)
		}
	})
}

export async function createBuildFolder() {
	return fs
		.stat("build")
		.catch(() => fs.mkdir("build").then(() => Log("INFO", "Build folder created!")))
		.then(() => clearBuild())
}

export async function getBuildFolderName() {
	return await BuildCache.getWithSetDefault("build-key", () => RandomString(16))
}

export let gamePath: string | null = null
export async function linkToGame() {
	const gamedataPath = getGamedataPath()
	await BuildCache.set("last-gamedata-path", pathinfo)
	if (gamedataPath) {
		const sourcePath = path.resolve("build")
		const targetPath = path.resolve(gamedataPath, "development_resource_packs", await getBuildFolderName())
		await fs.stat(targetPath).catch(async () => {
			await fs
				.symlink(sourcePath, targetPath, "junction")
				.then(() => Log("INFO", "Linked build folder to gamedata!"))
		})
		gamePath = gamedataPath
	} else console.warn("No gamedata path found, cannot link!")
}

export async function unlink() {
	const gamedataPath = await BuildCache.get<PathInfo>("last-gamedata-path")
	if (!gamedataPath?.gamepath) return
	const targetPath = path.resolve(gamedataPath.gamepath, "development_resource_packs", await getBuildFolderName())
	try {
		await fs.unlink(targetPath).then(() => Log("INFO", "Unlinked build folder from gamedata!"))
	} catch (error) {
		console.error(error)
	}
}

export async function getUUID(): Promise<[string, string]> {
	return await BuildCache.getWithSetDefault("uuid", () => {
		return [genUUID(), genUUID()]
	})
}
