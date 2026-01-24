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

	EOF,
}

export enum TSTokenKind {
	STRING,
	EXPRESSION,
}

export type TSToken =
	| {
			kind: TSTokenKind.EXPRESSION
			tokens: Token[]
	  }
	| {
			kind: TSTokenKind.STRING
			tokens: Token
	  }

export interface BaseToken {
	start: number
	length: number
}

export interface NormalToken extends BaseToken {
	value: string
	kind: Exclude<TokenKind, TokenKind.TEMPLATE_STRING>
}

export interface TemplateToken extends BaseToken {
	value: TSToken[]
	kind: TokenKind.TEMPLATE_STRING
}

export type Token = NormalToken | TemplateToken

export type Expression = string

export function makeToken<T extends TokenKind>(
	input: T extends TokenKind.TEMPLATE_STRING ? TSToken[] : string,
	kind: T,
	start: number,
	length: number = 1,
): Token {
	if (kind === TokenKind.TEMPLATE_STRING) {
		return { kind: kind, start, length, value: input as TSToken[] }
	} else {
		return { kind, start, length, value: input.slice(start, start + length) as string }
	}
}

export interface GenBinding {
	source: string
	target: string
}
