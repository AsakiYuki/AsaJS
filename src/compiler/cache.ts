import fs from "fs/promises"
import _fs from "fs"
import path from "path"

export class Cache {
	static cache: Record<string, any> = _fs.existsSync(path.join("build", "cache.json"))
		? JSON.parse(_fs.readFileSync(path.join("build", "cache.json"), "utf-8"))
		: {}

	static set<T>(key: string, value: T) {
		this.cache[key] = value
	}

	static get<T>(key: string): undefined | T {
		return this.cache[key]
	}

	static async save() {
		await fs.writeFile(path.resolve(path.join("build", "cache.json")), JSON.stringify(this.cache))
	}
}
