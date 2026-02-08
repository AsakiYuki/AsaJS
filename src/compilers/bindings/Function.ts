import { RandomBindingString } from "../../components/Utils.js"
import { Expression, GenBinding } from "./types.js"

type Callback = (...args: Expression[]) => {
	genBindings?: GenBinding[]
	value: Expression
}

export const FunctionMap = new Map<string, Callback>()

function callFn(name: string, ...args: Expression[]) {
	return FunctionMap.get(name)!(...args)
}

export const defaultFunctions = {
	/**
	 * Returns the absolute value of a number (the value without regard to whether it is positive or negative). For example, the absolute value of -5 is the same as the absolute value of 5.
	 * @param number
	 * @returns
	 */
	abs: number => {
		const randomBinding = RandomBindingString(16)
		return {
			genBindings: [{ source: `((-1 + (${number} > 0) * 2) * ${number})`, target: randomBinding }],
			value: randomBinding,
		}
	},

	/**
	 * Returns the negative absolute value of a number (the value without regard to whether it is positive or negative). For example, the absolute value of 5 is the same as the negative absolute value of -5.
	 * @param number
	 * @returns
	 */
	negabs: number => {
		const randomBinding = RandomBindingString(16)
		return {
			genBindings: [{ source: `((-1 + (${number} < 0) * 2) * ${number})`, target: randomBinding }],
			value: randomBinding,
		}
	},

	/**
	 * Generate a new binding for expression
	 * @param expression
	 * @returns
	 */
	new: expression => {
		const randomBinding = RandomBindingString(16)
		return {
			genBindings: [{ source: expression, target: randomBinding }],
			value: randomBinding,
		}
	},

	/**
	 * Returns the square root of a number.
	 * @param number
	 * @returns
	 */
	sqrt: number => {
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
	},

	/**
	 * Return a translatable string
	 * @param key
	 * @returns
	 */
	translatable: key => {
		return {
			value: `'%' + ${key}`,
		}
	},

	/**
	 * Return a binary of int32 number in string
	 * @param value
	 * @param bait
	 * @returns
	 */
	// bin: value => {
	// 	const {} = intToBin(value)

	// 	return {
	// 		value,
	// 	}
	// },

	/**
	 *  Generate value bindings
	 * @param value
	 * @param bait
	 * @returns
	 */
	bind: (value, bait) => {
		const ret = RandomBindingString(16)

		if (!bait) {
			throw new Error("Bait is required")
		}

		return {
			genBindings: [{ source: `((${bait} - ${bait}) + ${value})`, target: ret }],
			value: ret,
		}
	},

	/**
	 * Return a int of float number, because string in JSON-UI cannot read it.
	 * @param input
	 * @returns
	 */
	int: input => {
		const ret = RandomBindingString(16)
		return {
			genBindings: [{ source: `${input}`, target: ret }],
			value: ret,
		}
	},
} satisfies Record<string, Callback>

Object.entries(defaultFunctions).forEach(([key, value]) => FunctionMap.set(key, value))
