import { makeToken, TokenKind, Token, TSToken, TSTokenKind } from "./types.js"
import * as Checker from "./Checker.js"

export function Lexer(input: string, start: number = 0, end?: number) {
	const tokens: Token[] = []

	if (input.length === 0) return tokens

	let index = start
	do {
		const token = input[index]

		if (Checker.isBlankChar(token)) continue

		switch (token) {
			// Literals
			case "#":
			case "$": {
				const start = index++

				while (index < input.length) {
					const token = input[index]
					if (Checker.isWordChar(token)) index++
					else break
				}

				tokens.push(makeToken(input, TokenKind.VARIABLE, start, index-- - start))

				break
			}

			case "'": {
				const start = index++

				do {
					const token = input[index]
					if (token === "'") break
				} while (++index < input.length)

				tokens.push(makeToken(input, TokenKind.STRING, start, index - start + 1))

				break
			}

			case "`": {
				const tsTokens: TSToken[] = []
				const start = index

				const tokenization = (start: number) => {
					while (index < input.length) {
						const char = input[index]
						if (char === "`") {
							index++
							eatString()
						} else if (char === "}") {
							tsTokens.push({
								kind: TSTokenKind.EXPRESSION,
								tokens: Lexer(input, start + 1, index),
							})
							break
						}
						index++
					}
				}

				const stringification = (start: number) => {
					while (index < input.length) {
						const char = input[index]
						if (char === "`") {
							if (start + 1 !== index)
								tsTokens.push({
									kind: TSTokenKind.STRING,
									tokens: {
										kind: TokenKind.STRING,
										start: start + 1,
										length: index - start + 1,
										value: `'${input.slice(start + 1, index)}'`,
									},
								})

							break
						} else if (char === "$" && input[index + 1] === "{") {
							tsTokens.push({
								kind: TSTokenKind.STRING,
								tokens: {
									value: `'${input.slice(start + 1, index)}'`,
									kind: TokenKind.STRING,
									length: index - start + 1,
									start,
								},
							})
							tokenization(++index)
							start = index
						}
						index++
					}
				}

				const eatString = () => {
					while (index < input.length) {
						const char = input[index]

						if (char === "`") {
							break
						} else if (char === "$" && input[index + 1] === "{") {
							index++
							eatTemplate()
						}

						index++
					}
				}

				const eatTemplate = () => {
					while (index < input.length) {
						const char = input[index]
						if (char === "`") {
							eatString()
						} else if (char === "}") {
							break
						}
						index++
					}
				}

				stringification(index++)
				tokens.push(makeToken(tsTokens, TokenKind.TEMPLATE_STRING, start, index - start + 1))

				break
			}

			case ",":
				tokens.push(makeToken(input, TokenKind.COMMA, index))
				break

			// Single operators
			case "+":
			case "-":
			case "*":
			case "/":
			case "%":
				tokens.push(makeToken(input, TokenKind.OPERATOR, index))
				break

			case "(":
				tokens.push(makeToken(input, TokenKind.OPEN_PARENTHESIS, index))
				break

			case ")":
				tokens.push(makeToken(input, TokenKind.CLOSE_PARENTHESIS, index))
				break

			// Double operators
			case "&":
			case "|":
			case "=":
				if (input[index + 1] === input[index]) tokens.push(makeToken(input, TokenKind.OPERATOR, index++, 2))
				else tokens.push(makeToken(input, TokenKind.OPERATOR, index))
				break

			case "!":
			case ">":
			case "<":
				if (input[index + 1] === "=") tokens.push(makeToken(input, TokenKind.OPERATOR, index++, 2))
				else tokens.push(makeToken(input, TokenKind.OPERATOR, index))
				break

			default: {
				let start = index

				if (Checker.isNumberChar(token)) {
					while (Checker.isNumberChar(input[index + 1])) index++
					tokens.push(makeToken(input, TokenKind.NUMBER, start, index - start + 1))
				} else if (Checker.isWordChar(token)) {
					while (Checker.isWordChar(input[index + 1])) index++
					tokens.push(makeToken(input, TokenKind.WORD, start, index - start + 1))
				} else if (!Checker.isBlankChar(token)) {
					console.error(
						`\x1b[31m${input.slice(0, index)}>>>${token}<<<${input.slice(index + 1)}\nInvalid character.\x1b[0m`,
					)
					throw new Error()
				}
			}
		}
	} while (++index < (end || input.length))

	return tokens
}
