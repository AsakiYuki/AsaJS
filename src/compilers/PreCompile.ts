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
