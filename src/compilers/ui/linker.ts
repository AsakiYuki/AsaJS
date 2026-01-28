import fs from "fs/promises"
import { BuildCache } from "./buildcache.js"
import { RandomString } from "../../components/Utils.js"

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
	await fs.rm("build/build", { recursive: true, force: true })
}

export async function createBuildFolder() {
	return fs
		.stat("build")
		.catch(() => fs.mkdir("build"))
		.then(() => clearBuild())
}

export async function getBuildFolderName() {
	return await BuildCache.getWithSetDefault("build-key", () => RandomString(16))
}

export async function getUUID(): Promise<[string, string]> {
	return await BuildCache.getWithSetDefault("uuid", () => {
		return [genUUID(), genUUID()]
	})
}
