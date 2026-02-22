import { RandomBindingString, RandomString, ResolveBinding } from "../../components/Utils.js"
import { BindingItem } from "../../types/properties/value.js"
import { bindingFuntions } from "../Configuration.js"
import { isString } from "./Checker.js"
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

	contains: (source_str, contains_str) => {
		return {
			value: `not ((${source_str} - ${contains_str}) = ${source_str})`,
		}
	},

	starts_with: (source_str, start_str) => {
		const prefix = `'asajs:${RandomString(5)}:'`
		if (isString(source_str)) {
			if (isString(start_str)) {
				return {
					value: `${source_str.slice(1, -1).startsWith(start_str.slice(1, -1))}`,
				}
			} else {
				source_str = prefix.slice(0, -1) + source_str.slice(1)
				const start_str_bind = RandomBindingString()

				return {
					genBindings: [
						{
							source: `${prefix} + ${start_str}`,
							target: start_str_bind,
						},
					],
					value: `not ((${source_str} - ${start_str_bind}) = ${source_str})`,
				}
			}
		} else {
			if (isString(start_str)) {
				const strLength = start_str.length - 2
				return {
					value: `('%.${strLength}s' * ${source_str} = ${start_str})`,
				}
			} else {
				const source_str_bind = RandomBindingString()
				const start_str_bind = RandomBindingString()

				return {
					genBindings: [
						{
							source: `${prefix} + ${source_str}`,
							target: source_str_bind,
						},
						{
							source: `${prefix} + ${start_str}`,
							target: start_str_bind,
						},
					],
					value: `not ((${source_str_bind} - ${start_str_bind}) = ${source_str_bind})`,
				}
			}
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
if (bindingFuntions)
	Object.entries(bindingFuntions).forEach(([key, value]) => {
		// @ts-ignore
		FunctionMap.set(key, (...args) => {
			const { generate_bindings, return_value } = value(...args)
			if (generate_bindings) {
				const resolve = ResolveBinding(new Map(), ...(generate_bindings as BindingItem[]))
				return {
					genBindings: resolve.map(({ source_property_name, target_property_name }) => ({
						source: source_property_name!,
						target: target_property_name!,
					})),
					value: return_value,
				}
			}

			return {
				value: return_value,
			}
		})
	})
