import { Memory } from "./Memory.js"

process.on("beforeExit", () => {
	Memory.cache.forEach(({ elements, namespace }) => {
		const contents = Memory.gen_ui_file_contents(namespace, elements)
	})
})
