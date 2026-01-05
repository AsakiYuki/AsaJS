declare global {
	interface Map<K, V> {
		toJSON(): Record<string, V>
	}
}

Map.prototype.toJSON = function () {
	const obj: any = {}
	this.forEach((value, key) => (obj[key] = value))
	return obj
}
