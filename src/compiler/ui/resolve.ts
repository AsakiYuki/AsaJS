import { BindingType } from "../../types/ui/enums/BindingType.js"
import { BindingItem } from "../../types/ui/properties/value.js"
import { GetRandomBindingString } from "../../utils/Random.js"
import { isCompileBinding } from "./bindings/Checker.js"
import { Lexer } from "./bindings/Lexer.js"
import { Parser } from "./bindings/Parser.js"
import { TokenKind, TSTokenKind } from "./bindings/types.js"

export function ResolveBinding(cache: Map<string, unknown>, ...bindings: BindingItem[]) {
	const result: BindingItem[] = []

	for (const binding of bindings) {
		if (binding.source_property_name) {
			if (isCompileBinding(binding.source_property_name)) {
				const inputBindings = binding.source_property_name.slice(1, -1)
				if (binding.source_control_name) {
					// @ts-ignore
					const tokensMapping = (token: Token) => {
						if (token.kind === TokenKind.VARIABLE) {
							const mapkey = `mapping:${binding.source_control_name}:${token.value}`

							if (cache.has(mapkey)) {
								return {
									...token,
									value: cache.get(mapkey) as string,
								}
							} else {
								const ret = GetRandomBindingString()
								cache.set(mapkey, ret)

								result.push({
									source_property_name: token.value,
									source_control_name: binding.source_control_name,
									target_property_name: ret,
									binding_type: BindingType.VIEW,
								})

								return {
									...token,
									value: ret,
								}
							}
						} else if (token.kind === TokenKind.TEMPLATE_STRING) {
							return {
								...token,
								// @ts-ignore
								value: token.value.map((tstoken: TSToken) => {
									if (tstoken.kind === TSTokenKind.STRING) return tstoken
									else {
										return {
											...tstoken,
											tokens: tstoken.tokens.map(tokensMapping),
										}
									}
								}),
							}
						} else return token
					}

					const { gen, out } = new Parser(inputBindings, cache, Lexer(inputBindings).map(tokensMapping)).out()

					delete binding.source_control_name

					if (gen) result.push(...gen)
					binding.source_property_name = out
				} else {
					const { gen, out } = new Parser(inputBindings, cache).out()
					if (gen) result.push(...gen)
					binding.source_property_name = out
				}
			}
			binding.binding_type ||= BindingType.VIEW
			if (!binding.target_property_name) throw new Error("Binding must have a target property name")
		} else if (binding.binding_collection_name) {
			if (Object.keys(binding).length > 1) binding.binding_type ||= BindingType.COLLECTION
			else binding.binding_type ||= BindingType.COLLECTION_DETAILS
		}
		result.push(binding)
	}

	return result
}
