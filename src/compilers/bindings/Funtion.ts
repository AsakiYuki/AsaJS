import { RandomBindingString } from "../../components/Utils.js"
import { Expression, GenBinding } from "./types.js"

export const FuntionMap = new Map<
	string,
	(...args: Expression[]) => {
		genBindings?: GenBinding[]
		value: Expression
	}
>()

// Default Functions
FuntionMap.set("abs", number => {
	const randomBinding = RandomBindingString(16)
	return {
		genBindings: [{ source: `((-1 + (${number} > 0) * 2) * ${number})`, target: randomBinding }],
		value: randomBinding,
	}
})

FuntionMap.set("new", expression => {
	const randomBinding = RandomBindingString(16)
	return {
		genBindings: [{ source: expression, target: randomBinding }],
		value: randomBinding,
	}
})

FuntionMap.set("max", (...args) => {
	return {
		value: "#a",
	}
})
