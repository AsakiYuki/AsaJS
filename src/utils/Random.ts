import { Binding, Variable } from "../types/ui/properties/value.js"

const string_length = 25
const namespace_count = 15

export function GetRandomString() {
	const chars = "0123456789abcdefghijklmnopqrstuvwxyz"
	return Array.from({ length: string_length }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

const preGenNamespaces = Array.from({ length: namespace_count }, () => GetRandomString())
export function GetRandomNamespace() {
	return preGenNamespaces[Math.floor(Math.random() * namespace_count)]
}

export function GetRandomBindingString(): Binding {
	return `#${GetRandomString()}`
}

export function GetRandomVariableString(): Variable {
	return `$${GetRandomString()}`
}

const HEX: string[] = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"))
export function GetRandomUUID(): string {
	const b = Array.from({ length: 16 }, () => Math.floor(Math.random() * 256))
	b[6] = (b[6] & 0x0f) | 0x40
	b[8] = (b[8] & 0x3f) | 0x80
	return (
		`${HEX[b[0]]}${HEX[b[1]]}${HEX[b[2]]}${HEX[b[3]]}-` +
		`${HEX[b[4]]}${HEX[b[5]]}-` +
		`${HEX[b[6]]}${HEX[b[7]]}-` +
		`${HEX[b[8]]}${HEX[b[9]]}-` +
		`${HEX[b[10]]}${HEX[b[11]]}${HEX[b[12]]}${HEX[b[13]]}${HEX[b[14]]}${HEX[b[15]]}`
	)
}
