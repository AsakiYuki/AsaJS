import { RandomBindingString } from "../../components/Utils.js"
import { Expression, GenBinding } from "./types.js"

type CallbackRet = {
	genBindings?: GenBinding[]
	value: Expression
}
type Callback = (...args: Expression[]) => CallbackRet

export const FunctionMap = new Map<string, Callback>()

export const defaultFunctions = {
	/**
	 * Returns the absolute value of a number (the value without regard to whether it is positive or negative). For example, the absolute value of -5 is the same as the absolute value of 5.
	 * @param number
	 * @returns
	 */
	abs: number => {
		const randomBinding = RandomBindingString()
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
		const randomBinding = RandomBindingString()
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
		const randomBinding = RandomBindingString()
		return {
			genBindings: [{ source: expression, target: randomBinding }],
			value: randomBinding,
		}
	},

	sqrt: input => {
		const ret = RandomBindingString()

		const isNegative = RandomBindingString()
		const isLowerThanTwo = RandomBindingString()
		const next = RandomBindingString()
		const nextEqualOrGreaterThan = RandomBindingString()

		const isNextEqualOrGreaterThanRet = `(${nextEqualOrGreaterThan} * ${ret})`
		const isNotNextEqualOrGreaterThanRet = `((not ${nextEqualOrGreaterThan}) * ${next})`

		const lowerThanTwoPart = `(${isLowerThanTwo} * ${input})`
		const notLowerThanTwoPart = `((not ${isLowerThanTwo}) * (${isNextEqualOrGreaterThanRet} + ${isNotNextEqualOrGreaterThanRet}))`

		const negativePart = `(${isNegative} * -1)`
		const notNegativePart = `((not ${isNegative}) * (${lowerThanTwoPart} + ${notLowerThanTwoPart}))`

		return {
			genBindings: [
				{
					source: `(${input} < 0)`,
					target: isNegative,
				},
				{
					source: `(${input} < 2)`,
					target: isLowerThanTwo,
				},
				{
					source: input,
					target: ret,
				},
				{
					source: `(${ret} + ${input} / ${ret}) / 2`,
					target: next,
				},
				{
					source: `(${next} = ${ret}) or (${next} > ${ret})`,
					target: nextEqualOrGreaterThan,
				},
				{
					source: `${negativePart} + ${notNegativePart}`,
					target: ret,
				},
			],
			value: ret,
		}
	},

	cache_value: (cache_binding, override_binding, is_read) => {
		return {
			value: `((${is_read} * ${cache_binding}) + ((not ${is_read}) * ${override_binding}))`,
		}
	},

	vector_length: (x, y, z) => {
		const newBind = defaultFunctions.new(`${y} * ${y} + ${x} * ${x} + ${z} * ${z}`) as CallbackRet
		const sqrtBind = defaultFunctions.sqrt(newBind.value) as CallbackRet

		return {
			genBindings: [newBind.genBindings![0], ...sqrtBind.genBindings!],
			value: sqrtBind.value,
		}
	},

	strlen: str => {
		if (!/\#\w+/.test(str)) throw new Error("Invalid string")

		const count = RandomBindingString()
		const inputStr = RandomBindingString()

		return {
			genBindings: [
				{
					source: `0 * (${str} = 'a')`,
					target: count,
				},
				{
					source: `'a' + ${str}`,
					target: inputStr,
				},
				{
					source: `${count} + (not ((('%.' + (${count} + 1) + 's') * ${inputStr}) = ${inputStr}))`,
					target: count,
				},
			],
			value: count,
		}
	},

	/**
	 * Return a translatable string
	 * @param key
	 * @returns
	 */
	translatable: key => {
		return {
			genBindings: [],
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
		const ret = RandomBindingString()

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
		const ret = RandomBindingString()
		return {
			genBindings: [{ source: `${input}`, target: ret }],
			value: ret,
		}
	},
} satisfies Record<string, Callback>

Object.entries(defaultFunctions).forEach(([key, value]) => FunctionMap.set(key, value))
