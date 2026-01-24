import { makeToken, TokenKind, Token, TSToken, TSTokenKind } from "./types.js"
import * as Checker from "./Checker.js"

export function Lexer(input: string, start: number = 0, length?: number) {
	const tokens: Token[] = []

	if (input.length === 0) return tokens
	length ||= input.length

	console.log(input.slice(start, length))

	let index = start
	do {
		const token = input[index]

		if (Checker.isBlankChar(token)) continue

		switch (token) {
			// Literals
			case "#":
			case "$": {
				const start = index++
				while (index < length) {
					const token = input[index]
					if (Checker.isWordChar(token)) index++
					else {
						if (start + 1 === index) {
							console.error(
								`\x1b[31merror: ${input + "\n" + " ".repeat(index + 6) + "^"}\nInvalid character.\x1b[0m`,
							)
							throw new Error()
						}
						break
					}
				}

				tokens.push(makeToken(input, TokenKind.VARIABLE, start, index-- - start))

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

			// string
			case "'": {
				const start = index++

				do {
					const token = input[index]
					if (token === "'") break
				} while (++index < length)

				tokens.push(makeToken(input, TokenKind.STRING, start, index - start + 1))

				break
			}

			// template string
			case "f": {
				if (input[index + 1] === "'") {
					const tsTokens: TSToken[] = []
					const start = index

					const templateStringTokens = (start: number) => {
						while (index < length) {
							const char = input[index]

							if (char === "'") {
							}

							index++
						}
					}

					templateStringTokens(index)
					tokens.push(makeToken(tsTokens, TokenKind.TEMPLATE_STRING, start, index - start))
					break
				}
			}

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
						`\x1b[31merror: ${input + "\n" + " ".repeat(index + 7) + "^"}\nInvalid character.\x1b[0m`,
					)
					throw new Error()
				}
			}
		}
	} while (++index < length)

	return tokens
}
