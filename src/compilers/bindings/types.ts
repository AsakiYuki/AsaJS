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

export interface Token {
	kind: TokenKind
	value: string
	start: number
	length: number
}
