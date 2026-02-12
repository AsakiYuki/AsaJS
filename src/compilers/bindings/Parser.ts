import { Expression, GenBinding, Token, TokenKind, TSToken, TSTokenKind } from "./types.js"
import { BindingType } from "../../types/enums/BindingType.js"
import { BindingItem } from "../../types/properties/value.js"
import { FunctionMap } from "./Function.js"
import { Lexer } from "./Lexer.js"
import { RandomBindingString } from "../../components/Utils.js"

export class Parser {
	position: number = 0

	genBindings: GenBinding[] = []
	output: Expression
	tokens: Token[]

	constructor(
		private input: string,
		private cache = new Map<string, unknown>(),
		tokens?: Token[],
	) {
		if (tokens) {
			this.tokens = tokens
			tokens = undefined
		} else this.tokens = Lexer(input)

		this.output = this.parseExpression()

		if (this.at()) {
			this.expect(TokenKind.EOF, "Unexpected token!")
		}
	}

	static intToBin(input: string) {
		const bindings: GenBinding[] = []
		const rtn = RandomBindingString()

		for (let i = 0; i < 30; i++) {
			bindings.push({
				source: `(${input} / ${2 ** i} - (${input} / ${2 ** (i + 1)}) * 2)`,
				target: `${rtn}${i}`,
			})
		}

		return {
			ret: rtn,
			bindings,
		}
	}

	intToBin(input: string) {
		const inStr = `expr:${input}`

		if (this.cache.has(inStr)) {
			return this.cache.get(inStr) as string
		} else {
			const { ret, bindings } = Parser.intToBin(input)
			this.cache.set(inStr, ret)
			this.genBindings.push(...bindings)
			return ret
		}
	}

	at() {
		return this.tokens[this.position]
	}

	eat() {
		return this.tokens[this.position++]
	}

	last() {
		return this.tokens[this.tokens.length - 1]
	}

	private parseExpression(): Expression {
		return this.parseOrExpression()
	}

	private parseOrExpression(): Expression {
		let left = this.parseAndExpression(),
			current

		while ((current = this.at()) && this.at().kind === TokenKind.OPERATOR && current.value === "||") {
			this.eat()
			left = `(${left} or ${this.parseAndExpression()})`
		}

		return left
	}

	private parseAndExpression(): Expression {
		let left = this.parseComparisonExpression(),
			current

		while ((current = this.at()) && this.at().kind === TokenKind.OPERATOR && current.value === "&&") {
			this.eat()
			left = `(${left} and ${this.parseComparisonExpression()})`
		}

		return left
	}

	private parseComparisonExpression(): Expression {
		let left = this.parseAdditiveExpression(),
			current

		while (
			(current = this.at()) &&
			this.at().kind === TokenKind.OPERATOR &&
			["==", ">", "<", ">=", "<=", "!="].includes(<string>current.value)
		) {
			const operator = this.eat()
			const right = this.parseAdditiveExpression()

			switch (operator.value) {
				case "==":
					left = `(${left} = ${right})`
					break

				case "!=":
					left = `(not (${left} = ${right}))`
					break

				case ">=":
				case "<=":
					left = `((${left} ${operator.value[0]} ${right}) or (${left} = ${right}))`
					break

				default:
					left = `(${left} ${operator.value} ${right})`
					break
			}
		}

		return left
	}

	private parseAdditiveExpression(): Expression {
		let left = this.parseMultiplicativeExpression(),
			current

		while (
			(current = this.at()) &&
			this.at()?.kind === TokenKind.OPERATOR &&
			["+", "-"].includes(<string>current.value)
		) {
			const operator = this.eat()
			const right = this.parseMultiplicativeExpression()

			left = `(${left} ${operator.value} ${right})`
		}

		return left
	}

	private parseMultiplicativeExpression(): Expression {
		let left = this.parseBitwiseLogicExpression(),
			current

		while (
			(current = this.at()) &&
			this.at()?.kind === TokenKind.OPERATOR &&
			["*", "/", "%"].includes(<string>current.value)
		) {
			const operator = this.eat()
			const right = this.parsePrimaryExpression()

			if (current.value === "%") {
				const cacheStr = `expr:${left}${operator.value}${right}`
				if (this.cache.has(cacheStr)) {
					return (left = this.cache.get(cacheStr) as Expression)
				}

				const ret = RandomBindingString()

				this.genBindings.push({
					source: `(${left} - (${left} / ${right} * ${right}))`,
					target: ret,
				})

				this.cache.set(cacheStr, ret)
				left = ret
			} else left = `(${left} ${operator.value} ${right})`
		}

		return left
	}

	private parseBitwiseLogicExpression(): Expression {
		// TODO
		return this.parseBitwiseShiftExpression()
	}

	private parseBitwiseShiftExpression(): Expression {
		// TODO
		return this.parsePrimaryExpression()
	}

	private parsePrimaryExpression(): Expression {
		const left = this.at()

		switch (left?.kind) {
			case TokenKind.WORD:
				return this.parseCallableOrLiteral(this.eat())

			case TokenKind.OPEN_PARENTHESIS: {
				this.eat()
				const value = this.parseExpression()
				this.expect(TokenKind.CLOSE_PARENTHESIS, "Unexpected token!")
				this.eat()
				return `(${value})`
			}

			case TokenKind.INT: {
				const numberToken = this.eat()

				switch (numberToken.value[1]) {
					case "x":
						return "" + parseInt(numberToken.value.slice(2) as string, 16)

					case "o":
						return "" + parseInt(numberToken.value.slice(2) as string, 8)

					case "b":
						return "" + parseInt(numberToken.value.slice(2) as string, 2)

					default:
						const [num, exp] = (<string>numberToken.value).split("e")
						return "" + (exp ? +num * 10 ** +exp : num)
				}
			}

			case TokenKind.VARIABLE:
			case TokenKind.STRING:
				return <string>this.eat().value

			case TokenKind.TEMPLATE_STRING: {
				const out = (<TSToken[]>this.eat().value).map(v => {
					if (v.kind === TSTokenKind.STRING) return v.tokens.value
					else {
						const bakTokens = this.tokens
						const bakPosition = this.position

						this.tokens = v.tokens
						this.position = 0

						const out = this.parseExpression()

						this.tokens = bakTokens
						this.position = bakPosition

						return out
					}
				})
				return out.length === 1 ? (out[0] as string) : `(${out.join(" + ")})`
			}

			case TokenKind.OPERATOR: {
				if (left.value === "-" || left.value === "+") {
					this.eat()

					let negative = left.value === "-",
						current

					while ((current = this.at()) && current.kind === TokenKind.OPERATOR) {
						if (current.value === "-") {
							this.eat()
							negative = !negative
						} else if (current.value === "+") {
							this.eat()
							continue
						}
					}

					const value = this.parsePrimaryExpression()

					return negative ? `(0 - ${value})` : value
				} else if (left.value === "!") {
					this.eat()

					let not = true,
						current

					while ((current = this.at()) && current.kind === TokenKind.OPERATOR) {
						if (current.value === "!") {
							this.eat()
							not = !not
						}
					}

					const value = this.parsePrimaryExpression()
					return not ? `(not ${value})` : value
				}
			}

			default:
				this.expect(TokenKind.INT, "Unexpected token!")
		}

		return left.value
	}

	private parseCallableOrLiteral(callerToken: Token): Expression {
		const left = this.at()

		if (left?.kind === TokenKind.OPEN_PARENTHESIS) {
			this.eat()
			const args: Expression[] = []

			if (this.at().kind === TokenKind.COMMA) {
				this.expect(TokenKind.INT, "Unexpected token!")
			}

			if (this.at().kind !== TokenKind.CLOSE_PARENTHESIS) {
				args.push(this.parseExpression())

				while (this.at().kind === TokenKind.COMMA) {
					this.eat()
					if (this.at().kind === TokenKind.CLOSE_PARENTHESIS) {
						this.expect(TokenKind.INT, "Unexpected token!")
					}
					args.push(this.parseExpression())
				}
			}

			this.eat()

			const inputStr = `func:${callerToken.value}(${args.join(", ")})`

			if (this.cache.has(inputStr)) {
				return this.cache.get(inputStr) as Expression
			} else {
				const ret = this.functionCall(<string>callerToken.value, ...args)
				this.cache.set(inputStr, ret)
				return ret
			}
		} else if (left?.kind === TokenKind.OPERATOR) {
			this.warn(
				`Implicit string literal '${callerToken.value}'. Use quoted string ('${callerToken.value}') for clarity!`,
				callerToken,
			)
			return <string>callerToken.value
		} else {
			if (callerToken.kind === TokenKind.WORD)
				this.warn(
					`Implicit string literal '${callerToken.value}'. Use quoted string ('${callerToken.value}') for clarity!`,
					callerToken,
				)
			else this.expect(TokenKind.WORD, "Unexpected token!")
			return <string>callerToken.value
		}
	}

	private functionCall(name: string, ...params: Expression[]): Expression {
		const func = FunctionMap.get(name.toLowerCase())
		if (!func) {
			return this.expect(TokenKind.WORD, "Function not found!")!
		} else {
			const { genBindings, value } = func(...params)
			if (genBindings) this.genBindings.push(...genBindings)
			return `(${value})`
		}
	}

	private expect(kind: TokenKind, err: string) {
		const prev = this.at() || this.last()
		if (!prev || prev.kind !== kind) {
			throw new Error(
				`\x1b[31m${this.getPointer(prev)}\n` + `[ERROR]: ${err}\x1b[0m - Expected ${TokenKind[kind]}`,
			)
		}
	}

	private warn(err: string, token?: Token) {
		const prev = token || this.at()
		console.warn(`\x1b[33mwarn:${this.getPointer(prev, true)}\n` + `[WARNING]: ${err}\x1b[0m`)
	}

	private getPointer(token: Token, isWarn = false) {
		return this.input + "\n" + " ".repeat(token.start + (isWarn ? 5 : 7)) + "^".repeat(token.length)
	}

	out(): { gen?: BindingItem[]; out: Expression; cache: Map<string, unknown> } {
		return {
			out: `(${this.output})`,
			cache: this.cache,
			gen: this.genBindings.map(
				({ source, target }) =>
					<BindingItem>{
						binding_type: BindingType.VIEW,
						source_property_name: `(${source})`,
						target_property_name: `${target}`,
					},
			),
		}
	}
}
