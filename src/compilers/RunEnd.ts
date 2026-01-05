import { Memory } from "./Memory.js"

process.on("beforeExit", () => {
	Memory.cache.forEach(({ elements, namespace }) => {
		console.log(Memory.gen_ui_file_content(namespace, elements))
	})
})
