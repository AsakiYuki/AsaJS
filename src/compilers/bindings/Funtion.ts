import { RandomBindingString } from "../../components/Utils.js"
import { Parser } from "./Parser.js"
import { Expression, GenBinding } from "./types.js"

type Callback = (...args: Expression[]) => {
	genBindings?: GenBinding[]
	value: Expression
}

export const FunctionMap = new Map<string, Callback>()

function callFn(name: string, ...args: Expression[]) {
	return FunctionMap.get(name)!(...args)
}

// Default Functions
FunctionMap.set("abs", number => {
	const randomBinding = RandomBindingString(16)
	return {
		genBindings: [{ source: `((-1 + (${number} > 0) * 2) * ${number})`, target: randomBinding }],
		value: randomBinding,
	}
})

FunctionMap.set("new", expression => {
	const randomBinding = RandomBindingString(16)
	return {
		genBindings: [{ source: expression, target: randomBinding }],
		value: randomBinding,
	}
})

FunctionMap.set("sqrt", number => {
	const rtn = RandomBindingString(16),
		$1 = RandomBindingString(16),
		$2 = RandomBindingString(16)

	const { genBindings: absValue, value: absRtn } = callFn("abs", number)

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

FunctionMap.set("translatable", key => {
	return {
		value: `'%' + ${key}`,
	}
})

FunctionMap.set("bin", input => {
	const { ret, bindings } = Parser.intToBin(input)

	bindings.push({
		source: `'§z' + ${Array.from({ length: 30 }, (_, i) => `${ret}${30 - i - 1}`).join(" + ")}`,
		target: ret,
	})

	return { genBindings: bindings, value: ret }
})
