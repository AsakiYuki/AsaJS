export {} // 👈 BẮT BUỘC

declare global {
	interface String {
		toCamelCase(upcaseTop?: boolean): string
		toSnakeCase(): string
	}
}

String.prototype.toCamelCase = function (this: string, upcaseTop: boolean): string {
	const a = this.replace(/_([a-z])/g, g => g[1].toUpperCase())
	return upcaseTop ? a.charAt(0).toUpperCase() + a.slice(1) : a
}

String.prototype.toSnakeCase = function (this: string): string {
	return this.replace(/([A-Z])/g, "_$1").toLowerCase()
}
