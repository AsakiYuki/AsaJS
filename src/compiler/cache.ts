import fs from "fs/promises"
import _fs from "fs"
import path from "path"

type GenericValue = string | number | boolean | object | null | undefined

export class Cache {
	static cache: Record<string, any> = _fs.existsSync(path.join("build", "cache.json"))
		? JSON.parse(_fs.readFileSync(path.join("build", "cache.json"), "utf-8"))
		: {}

	static set<T extends GenericValue>(key: string, value: T) {
		this.cache[key] = value
	}

	static get<T extends GenericValue>(key: string, defaultValue?: (() => T) | T): undefined | T {
		const ret = this.cache[key]
		if (!ret && defaultValue) {
			if (defaultValue instanceof Function) defaultValue = defaultValue()
			this.set(key, defaultValue)
			return defaultValue
		}
		return ret
	}

	static async save() {
		await fs.writeFile(path.resolve(path.join("build", "cache.json")), JSON.stringify(this.cache))
	}
}
