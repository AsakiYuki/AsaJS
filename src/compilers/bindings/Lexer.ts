import { makeToken, TokenKind, Token } from "./types.js"
import * as Checker from "./Checker.js"

export function Lexer(input: string) {
	const tokens: Token[] = []

	if (input.length === 0) return tokens

	let index = 0
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
				const start = index++,
					struct: boolean[] = []

				do {
					const token = input[index]
					let lastStruct = struct.lastItem()

					if (token === "`") {
						if (struct.length) {
							if (lastStruct === false) struct.pop()
							else struct.push(false)
						} else break
					}

					if (token === "$") {
						if (input[index + 1] === "{" && !lastStruct) {
							struct.push(true)
							index++
						}
					}

					if (token === "}" && lastStruct === true) struct.pop()
				} while (++index < input.length)

				tokens.push(makeToken(input, TokenKind.TEMPLATE_STRING, start, index - start + 1))

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
				}
			}
		}
	} while (++index < input.length)

	return tokens
}
