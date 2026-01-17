import JSONC from "jsonc-parser"
import fsp from "fs/promises"
import fs from "fs"

if (!fs.existsSync("cache")) fs.mkdirSync("cache")

export const Github = {
	readFile: async (user: string, repo: string, branches: string, path: string) => {
		try {
			return fetch(`https://raw.githubusercontent.com/${user}/${repo}/refs/heads/${branches}/${path}`).then(res =>
				res.text(),
			)
		} catch (error) {
			console.error(error)
			process.exit(1)
		}
	},
}

export const PFFS = {
	// Sync
	readFile: (file: string) => {
		try {
			return fs.readFileSync(`cache/${file}`, "utf-8")
		} catch (error) {
			console.error(error)
			process.exit(1)
		}
	},

	writeFile: (file: string, data: string) => {
		try {
			file.split("/").reduce((a, b) => {
				if (!fs.existsSync("cache/" + a)) fs.mkdirSync("cache/" + a)
				return `${a}/${b}`
			})

			return fsp.writeFile(`cache/${file}`, data)
		} catch (error) {
			console.error(error)
			process.exit(1)
		}
	},

	readFileJSON: (file: string) => {
		try {
			return JSONC.parse(PFFS.readFile(file))
		} catch (error) {
			console.error(error)
			process.exit(1)
		}
	},

	writeFileJSON: (file: string, data: object) => {
		try {
			return PFFS.writeFile(file, JSON.stringify(data))
		} catch (error) {
			console.error(error)
			process.exit(1)
		}
	},
}
