import { Token, TokenKind } from "./types.js"

export const BindingTranspiler = {
	isBlankChar(char: string) {
		return /\s/.test(char)
	},

	isWordChar(char: string) {
		return char && /\w/.test(char)
	},

	isNumberChar(char: string) {
		return /\d/.test(char)
	},

	token(input: string, kind: TokenKind, start: number, length: number = 1): Token {
		return {
			value: input.slice(start, start + length),
			kind,
			start,
			length,
		}
	},

	lexer(input: string) {
		const tokens: Token[] = []

		let index = 0
		do {
			const token = input[index]

			if (BindingTranspiler.isBlankChar(token)) continue

			switch (token) {
				// Literals
				case "#":
				case "$": {
					const start = index++

					do {
						const token = input[index]
						if (BindingTranspiler.isWordChar(token)) continue
						else break
					} while (++index < input.length)

					tokens.push(BindingTranspiler.token(input, TokenKind.VARIABLE, start, index - start))

					break
				}

				case "'": {
					const start = index++

					do {
						const token = input[index]
						if (token === "'") break
					} while (++index < input.length)

					tokens.push(BindingTranspiler.token(input, TokenKind.STRING, start, index - start + 1))

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

					tokens.push(BindingTranspiler.token(input, TokenKind.TEMPLATE_STRING, start, index - start + 1))

					break
				}

				case ",":
					tokens.push(BindingTranspiler.token(input, TokenKind.COMMA, index))
					break

				// Single operators
				case "+":
				case "-":
				case "*":
				case "/":
					tokens.push(BindingTranspiler.token(input, TokenKind.OPERATOR, index))
					break

				case "(":
					tokens.push(BindingTranspiler.token(input, TokenKind.OPEN_PARENTHESIS, index))
					break

				case ")":
					tokens.push(BindingTranspiler.token(input, TokenKind.CLOSE_PARENTHESIS, index))
					break

				// Double operators
				case "&":
				case "|":
				case "=":
					if (input[index + 1] === input[index])
						tokens.push(BindingTranspiler.token(input, TokenKind.OPERATOR, ++index, 2))
					else tokens.push(BindingTranspiler.token(input, TokenKind.OPERATOR, index))
					break

				case "!":
				case ">":
				case "<":
					if (input[index + 1] === "=")
						tokens.push(BindingTranspiler.token(input, TokenKind.OPERATOR, ++index, 2))
					else tokens.push(BindingTranspiler.token(input, TokenKind.OPERATOR, index))
					break

				default: {
					let start = index

					if (BindingTranspiler.isNumberChar(token)) {
						while (BindingTranspiler.isNumberChar(input[index + 1])) index++
						tokens.push(BindingTranspiler.token(input, TokenKind.NUMBER, start, index - start + 1))
					} else if (BindingTranspiler.isWordChar(token)) {
						while (BindingTranspiler.isWordChar(input[index + 1])) index++
						tokens.push(BindingTranspiler.token(input, TokenKind.WORD, start, index - start + 1))
					}
				}
			}
		} while (++index < input.length)

		return tokens
	},

	parser(input: string, tokens: Token[]) {},
}
