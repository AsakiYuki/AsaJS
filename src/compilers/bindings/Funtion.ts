import { RandomBindingString } from "../../components/Utils.js"
import { Expression, GenBinding } from "./types.js"

type Callback = (...args: Expression[]) => {
	genBindings?: GenBinding[]
	value: Expression
}

export const FuntionMap = new Map<string, Callback>()

function callFn(name: string, ...args: Expression[]) {
	return FuntionMap.get(name)!(...args)
}

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

FuntionMap.set("sqrt", number => {
	const rtn = RandomBindingString(16),
		$1 = RandomBindingString(16),
		$2 = RandomBindingString(16)

	const { genBindings: absValue, value: absRtn } = callFn("abs")

	return {
		genBindings: [
			{
				source: `${number} * 100 / 2`,
				target: $1,
			},
			...absValue!,
			{
				source: `${absRtn} > 1`,
				target: $2,
			},
			{
				source: `(${number} < 0) * -1 + (${number} > -1) * (${$2} * ((${rtn} + ${number} / ${rtn}) / 2) + (not ${$2}) * ${rtn})`,
				target: rtn,
			},
		],
		value: rtn,
	}
})
