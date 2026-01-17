import { BindingType } from "../../types/enums/BindingType.js"
import { BindingItem } from "../../types/properties/value.js"
import { FuntionMap } from "./Funtion.js"
import { Lexer } from "./Lexer.js"
import { Expression, GenBinding, Token, TokenKind, TSToken, TSTokenKind } from "./types.js"

export class Parser {
	position: number = 0
	tokens: Token[]

	genBindings: GenBinding[] = []
	output: Expression

	constructor(private input: string) {
		this.tokens = Lexer(this.input)
		this.output = this.parseExpression()
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

		while (
			(current = this.at()) &&
			this.at().kind === TokenKind.OPERATOR &&
			["||"].includes(<string>current.value)
		) {
			this.eat()
			left = `(${left} or ${this.parseAndExpression()})`
		}

		return left
	}

	private parseAndExpression(): Expression {
		let left = this.parseComparisonExpression(),
			current

		while (
			(current = this.at()) &&
			this.at().kind === TokenKind.OPERATOR &&
			["&&"].includes(<string>current.value)
		) {
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
		let left = this.parsePrimaryExpression(),
			current

		while (
			(current = this.at()) &&
			this.at()?.kind === TokenKind.OPERATOR &&
			["*", "/", "%"].includes(<string>current.value)
		) {
			const operator = this.eat()
			const right = this.parsePrimaryExpression()

			if (current.value === "%") left = `(${left} - ${left} / ${right} * ${right})`
			else left = `(${left} ${operator.value} ${right})`
		}

		return left
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

			case TokenKind.VARIABLE:
			case TokenKind.NUMBER:
			case TokenKind.STRING:
				return <string>this.eat().value

			case TokenKind.TEMPLATE_STRING:
				return `(${(<TSToken[]>this.eat().value)
					.map(v => {
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
					.join(" + ")})`

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
				console.log(left)
				this.expect(TokenKind.NUMBER, "Unexpected token!")
		}

		return <string>left.value
	}

	private parseCallableOrLiteral(callerToken: Token): Expression {
		const left = this.at()

		if (left?.kind === TokenKind.OPEN_PARENTHESIS) {
			this.eat()
			const args: Expression[] = []

			if (this.at().kind === TokenKind.COMMA) {
				this.expect(TokenKind.NUMBER, "Unexpected token!")
			}

			if (this.at().kind !== TokenKind.CLOSE_PARENTHESIS) {
				args.push(this.parseExpression())

				while (this.at().kind === TokenKind.COMMA) {
					this.eat()
					if (this.at().kind === TokenKind.CLOSE_PARENTHESIS) {
						this.expect(TokenKind.NUMBER, "Unexpected token!")
					}
					args.push(this.parseExpression())
				}
			}

			this.eat()

			return this.funtionCall(<string>callerToken.value, ...args)
		} else {
			this.warn(
				`Implicit string literal '${callerToken.value}'. Use quoted string ('${callerToken.value}') for clarity!`,
				callerToken,
			)
			return <string>callerToken.value
		}
	}

	private funtionCall(name: string, ...params: Expression[]): Expression {
		const func = FuntionMap.get(name.toLowerCase())
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
		console.warn(`\x1b[33m${this.getPointer(prev)}\n` + `[WARNING]: ${err}\x1b[0m`)
	}

	private getPointer(token: Token) {
		return `${this.input.slice(0, token.start)}>>>${this.input.slice(
			token.start,
			token.start + token.length,
		)}<<<${this.input.slice(token.start + token.length)}`
	}

	out(): { gen?: BindingItem[]; out: Expression } {
		return {
			out: this.output,
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
