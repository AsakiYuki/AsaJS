import { BindingType } from "../../types/enums/BindingType.js"
import { BindingItem } from "../../types/properties/value.js"
import { FuntionMap } from "./Funtion.js"
import { Lexer } from "./Lexer.js"
import { Expression, GenBinding, Token, TokenKind } from "./types.js"

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
		return this.parseAdditiveExpression()
	}

	private parseAdditiveExpression(): Expression {
		let left = this.parseMultiplicativeExpression(),
			current

		while (
			(current = this.at()) &&
			this.at()?.kind === TokenKind.OPERATOR &&
			["+", "-", "==", ">", "<", ">=", "<=", "!=", "&&", "||"].includes(current.value)
		) {
			const operator = this.eat()
			const right = this.parseMultiplicativeExpression()

			switch (operator.value) {
				case "==":
					left = `(${left} = ${right})`
					break

				case ">=":
				case "<=":
					left = `((${left} ${operator.value[0]} ${right}) or (${left} = ${right}))`
					break

				case "!=":
					left = `(not (${left} = ${right}))`
					break

				case "&&":
					left = `(${left} and ${right})`
					break

				case "||":
					left = `(${left} or ${right})`
					break

				default:
					left = `(${left} ${operator.value} ${right})`
					break
			}
		}

		return left
	}

	private parseMultiplicativeExpression(): Expression {
		let left = this.parsePrimaryExpression(),
			current

		while (
			(current = this.at()) &&
			this.at()?.kind === TokenKind.OPERATOR &&
			["*", "/", "%"].includes(current.value)
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
				return this.parseCallExpression(this.eat())

			case TokenKind.OPEN_PARENTHESIS: {
				this.eat()
				const value = this.parseExpression()
				this.expect(TokenKind.CLOSE_PARENTHESIS, "Unexpected token!")
				this.eat()
				return `(${value})`
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
				} else break
			}

			case TokenKind.VARIABLE:
			case TokenKind.NUMBER:
			case TokenKind.STRING:
				return this.eat().value

			case undefined:
				this.expect(TokenKind.NUMBER, "Unexpected token!")
		}

		return left.value
	}

	private parseCallExpression(callerToken: Token): Expression {
		const left = this.at()

		if (left?.kind === TokenKind.OPEN_PARENTHESIS) {
			this.eat()
			const args: Expression[] = []

			if (this.at().kind !== TokenKind.CLOSE_PARENTHESIS) {
				args.push(this.parseExpression())

				while (this.at().kind === TokenKind.COMMA) {
					this.eat()
					if (this.at().kind === TokenKind.CLOSE_PARENTHESIS) {
						this.expect(TokenKind.CLOSE_PARENTHESIS, "Unexpected token!")
					}
					args.push(this.parseExpression())
				}
			}

			this.eat()

			return this.funtionCall(callerToken.value, ...args)
		} else {
			this.warn("This token should be a string!", callerToken)
			return callerToken.value
		}
	}

	private funtionCall(name: string, ...params: Expression[]): Expression {
		const func = FuntionMap.get(name)
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
				`\x1b[31m${this.getPointer(prev)}\n` + `[ERROR]: ${err}\x1b[0m - Expected ${TokenKind[kind]}`
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
			token.start + token.length
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
					}
			),
		}
	}
}
