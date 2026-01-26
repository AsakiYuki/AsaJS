import { isBuildMode } from "./Configuration.js"
import { Memory } from "./Memory.js"

if (isBuildMode) {
	process.on("beforeExit", () => {
		console.log(JSON.stringify(Memory.build(), null, 2))
	})
}
