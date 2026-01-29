import fs from "fs"

export let prevData: {
	files: string[]
}

try {
	prevData = JSON.parse(fs.readFileSync("build/build.json", "utf-8"))
} catch (error) {
	prevData = { files: [] }
}
