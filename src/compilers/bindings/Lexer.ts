import { makeToken, TokenKind, Token, TSToken, TSTokenKind } from "./types.js"
import * as Checker from "./Checker.js"

export function Lexer(input: string, start: number = 0, end?: number) {
	const tokens: Token[] = []

	if (input.length === 0) return tokens
	const length = (end ||= input.length)

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
			case "^":
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
				else {
					if (input[index] === input[index + 1]) {
						if (input[index] !== "!") tokens.push(makeToken(input, TokenKind.OPERATOR, index++, 2))
						else tokens.push(makeToken(input, TokenKind.OPERATOR, index))
					} else tokens.push(makeToken(input, TokenKind.OPERATOR, index))
				}
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
					index += 2

					const templateStringTokens = (start: number) => {
						while (index < length) {
							const char = input[index++]

							if (char === "#") {
								if (input[index] === "{") {
									if (start !== index - 1)
										tsTokens.push({
											kind: TSTokenKind.STRING,
											tokens: {
												kind: TokenKind.STRING,
												start: start,
												length: index - start,
												value: `'${input.slice(start, index - 1)}'`,
											},
										})
									start = index + 1
									eatExpression(index)
									tsTokens.push({
										kind: TSTokenKind.EXPRESSION,
										tokens: Lexer(input, start, index),
									})
									start = index += 1
								}
							} else if (char === "'") {
								if (start !== index - 1)
									tsTokens.push({
										kind: TSTokenKind.STRING,
										tokens: {
											kind: TokenKind.STRING,
											start: start,
											length: index - start,
											value: `'${input.slice(start, index - 1)}'`,
										},
									})
								break
							}
						}
					}

					const eatExpression = (start: number) => {
						while (index < length) {
							const char = input[index]
							if (char === "'") eatString(++index)
							else if (char === "}") break
							else if (char === "f") {
								if (input[++index] === "'") {
									eatTemplateString(++index)
								}
							}
							index++
						}
					}

					const eatTemplateString = (start: number) => {
						while (index < length) {
							const char = input[index]

							if (char === "'") break
							else if (char === "#") {
								if (input[++index] === "{") eatExpression(++index)
							}

							index++
						}
					}

					const eatString = (start: number) => {
						while (index < length) {
							const char = input[index]
							if (char === "'") break
							index++
						}
					}

					templateStringTokens(index)

					if (tsTokens.length)
						tokens.push(makeToken(tsTokens, TokenKind.TEMPLATE_STRING, start, index - start))
					else tokens.push(makeToken(input, TokenKind.STRING, start + 1, index - start - 1))
					break
				}
			}

			default: {
				let start = index

				if (Checker.isNumberChar(token)) {
					if (token === "0") {
						const numType = input[index + 1]
						if (numType === "x") {
							index += 2
							while (Checker.isHexChar(input[index + 1])) index++
							if (start + 2 === index) {
								console.error(
									`\x1b[31merror: ${input + "\n" + " ".repeat(index + 6) + "^"}\nInvalid character.\x1b[0m`,
								)
								throw new Error()
							}
							tokens.push(makeToken(input, TokenKind.NUMBER, start, index - start + 1))
							break
						} else if (numType === "b") {
							index += 2
							while (Checker.isBinaryChar(input[index + 1])) index++
							tokens.push(makeToken(input, TokenKind.NUMBER, start, index - start + 1))
							if (start + 2 === index) {
								console.error(
									`\x1b[31merror: ${input + "\n" + " ".repeat(index + 6) + "^"}\nInvalid character.\x1b[0m`,
								)
								throw new Error()
							}
							break
						} else if (numType === "o") {
							index += 2
							while (Checker.isOctalChar(input[index + 1])) index++
							tokens.push(makeToken(input, TokenKind.NUMBER, start, index - start + 1))
							if (start + 2 === index) {
								console.error(
									`\x1b[31merror: ${input + "\n" + " ".repeat(index + 6) + "^"}\nInvalid character.\x1b[0m`,
								)
								throw new Error()
							}
							break
						}
					}

					while (Checker.isNumberChar(input[index + 1])) index++
					if (input[index + 1] === "e") {
						index++
						if (input[index + 1] === "-") index++
						if (!Checker.isNumberChar(input[index + 1])) {
							console.error(
								`\x1b[31merror: ${input + "\n" + " ".repeat(index + 7) + "^"}\nInvalid character.\x1b[0m`,
							)
							throw new Error()
						}
						while (Checker.isNumberChar(input[index + 1])) index++
					}

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
