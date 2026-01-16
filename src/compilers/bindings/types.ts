export enum TokenKind {
	VARIABLE,
	NUMBER,
	STRING,
	TEMPLATE_STRING,
	WORD,

	OPEN_PARENTHESIS,
	CLOSE_PARENTHESIS,

	OPERATOR,
	COMMA,
}

export enum GroupType {
	FUNCTION_CALL,
	FUNCTION_PARAMS,
	OPERATOR_SCOPE,
}

export interface Token {
	kind: TokenKind
	value: string
	start: number
	length: number
}

export type Expression = string

export function makeToken(input: string, kind: TokenKind, start: number, length: number = 1): Token {
	return {
		value: input.slice(start, start + length),
		kind,
		start,
		length,
	}
}

export interface GenBinding {
	source: string
	target: string
}
