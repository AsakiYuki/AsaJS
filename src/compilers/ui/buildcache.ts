import fs from "fs/promises"

export class BuildCache {
	private static queue: Promise<void> = Promise.resolve()

	private static async enqueue<T>(task: () => Promise<T>): Promise<T> {
		let result!: T
		this.queue = this.queue.then(async () => {
			result = await task()
		})
		return this.queue.then(() => result)
	}

	static async get<T = unknown>(key: string): Promise<T | null> {
		return this.enqueue<T>(async () => {
			try {
				return await fs.readFile("build/cache.json", "utf-8").then(data => JSON.parse(data)[key] ?? null)
			} catch (error) {
				return null
			}
		})
	}

	static async getWithDefault<T = unknown>(key: string, defaultValue: (() => T) | T): Promise<T> {
		const outVal = typeof defaultValue === "function" ? (defaultValue as () => T)() : defaultValue
		return this.get<T>(key).then(value => value ?? outVal)
	}

	static async getWithSetDefault<T>(key: string, defaultValue: (() => T) | T): Promise<T> {
		const outVal = typeof defaultValue === "function" ? (defaultValue as () => T)() : defaultValue

		return this.enqueue(async () => {
			let data: Record<string, any> = {}

			try {
				data = JSON.parse(await fs.readFile("build/cache.json", "utf-8"))
			} catch {}

			if (key in data) return data[key]
			data[key] = outVal

			await fs.writeFile("build/cache.json", JSON.stringify(data), "utf-8")
			return outVal
		})
	}

	static async set(key: string, value: unknown) {
		return this.enqueue(async () => {
			try {
				return fs.writeFile(
					"build/cache.json",
					JSON.stringify({
						...(await fs.readFile("build/cache.json", "utf-8").then(data => JSON.parse(data))),
						[key]: value,
					}),
					"utf-8",
				)
			} catch (error) {
				return fs.writeFile("build/cache.json", JSON.stringify({ [key]: value }), "utf-8")
			}
		})
	}
}
