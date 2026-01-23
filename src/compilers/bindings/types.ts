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

	EOF
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
		return { value: input as TSToken[], kind: kind, start, length }
	} else {
		return { value: input.slice(start, start + length) as string, kind, start, length }
	}
}

export interface GenBinding {
	source: string
	target: string
}
