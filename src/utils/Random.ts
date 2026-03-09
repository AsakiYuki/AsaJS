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
