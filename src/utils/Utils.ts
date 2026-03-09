import { Array3 } from "../types/ui/properties/value.js"

export function Color(hex: string | number): Array3<number> {
	if (typeof hex === "number") {
		return [((hex >> 16) & 0xff) / 0xff, ((hex >> 8) & 0xff) / 0xff, (hex & 0xff) / 0xff]
	} else {
		if (hex.startsWith("#")) {
			if (hex.length === 7)
				return [
					parseInt(hex.slice(1, 3), 16) / 0xff,
					parseInt(hex.slice(3, 5), 16) / 0xff,
					parseInt(hex.slice(5, 7), 16) / 0xff,
				]
			if (hex.length === 4)
				return [
					parseInt(hex.slice(1, 2).repeat(2), 16) / 0xff,
					parseInt(hex.slice(2, 3).repeat(2), 16) / 0xff,
					parseInt(hex.slice(3, 4).repeat(2), 16) / 0xff,
				]

			console.error(`Invalid color: ${hex}`)
			process.exit(1)
		} else {
			console.error(`Invalid color: ${hex}`)
			process.exit(1)
		}
	}
}

export let defaultNamespace: string | null = null

export function SetDefaultNamespace(input: string) {
	if (!/\p{L}+/u.test(input)) throw new Error("Invalid namespace")
	defaultNamespace = input
}
export function ClearDefaultNamespace() {
	defaultNamespace = null
}
