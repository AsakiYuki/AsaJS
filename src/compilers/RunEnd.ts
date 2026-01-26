import { Memory } from "./Memory.js"

const isBuildMode = process.argv.includes("--build")

if (isBuildMode) {
	process.on("beforeExit", () => {
		console.log(JSON.stringify(Memory.build(), null, 2))
	})
}
