import fs from "fs/promises"

export async function clearBuild() {
	await fs.rm("build/build", { recursive: true, force: true })
}

export async function createBuildFolder() {
	return fs
		.stat("build")
		.catch(() => fs.mkdir("build"))
		.then(() => clearBuild())
}
