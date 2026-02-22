import { writeFileSync } from "fs"
import { paths } from "../src/types/vanilla/paths"

const newPaths: Record<string, any> = {}

Object.entries(paths).forEach(([key, values]) => {
	const paths = Array.from(new Set(Object.values(values)))
	console.log(key)
	if (paths.length === 1) {
		newPaths[key] = paths[0]
	} else {
		newPaths[key] = values
	}
})

writeFileSync("src/types/vanilla/paths.ts", `export const paths = ${JSON.stringify(newPaths, null, 4)}`, "utf-8")
