import { RandomBindingString } from "../../components/Utils.js"
import { Binding } from "../../types/properties/value.js"
import { defaultFunctions } from "./Function.js"
import { GenBinding } from "./types.js"

export function intToBin(input: string) {
	const { abs, negabs } = defaultFunctions

	const ret = RandomBindingString()
	const bindings: GenBinding[] = []

	// negative bit
	bindings.push({
		source: `(${input} < 0)`,
		target: `${ret}0`,
	})

	return {
		ret,
		bindings,
	}
}

export function binToInt(input: Binding) {
	const ret = RandomBindingString()
	const bindings: GenBinding[] = []

	const nevBind = (input + "0") as Binding

	// Is reverse to positive
	bindings.push({
		source: `(-1 + ((${nevBind} = 0) * 2))`,
		target: `${ret}0`,
	})

	bindings.push({
		source: `(${Array.from({ length: 31 }, ($, i) => {
			return `${input}${i + 1}`
		}).join(" + ")})`,
		target: ret,
	})

	return {
		ret,
		bindings,
	}
}
