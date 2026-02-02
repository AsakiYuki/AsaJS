declare global {
	interface Map<K, V> {
		toJSON(): Record<string, V>
	}

	interface Array<T> {
		lastItem(): T
	}
}

Map.prototype.toJSON = function () {
	const obj: any = {}
	this.forEach((value, key) => (obj[key] = value))
	return obj
}

Array.prototype.lastItem = function () {
	return this[this.length - 1]
}

const now = performance.now()
type LogType = "INFO"

function TypeHighlight(type: LogType) {
	switch (type) {
		case "INFO":
			return `\x1b[32mINFO\x1b[0m`
		default:
			return type satisfies never
	}
}

export function Log(type: LogType, message: string) {
	console.log(
		`\x1b[90m[${(performance.now() - now).toFixed(2)}ms]\x1b[0m`,
		`[${TypeHighlight(type)}]`,
		message,
		"\x1b[0m",
	)
}
