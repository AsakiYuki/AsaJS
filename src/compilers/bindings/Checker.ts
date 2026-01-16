export function isBlankChar(char: string) {
	return /\s/.test(char)
}

export function isWordChar(char: string) {
	return char && /\w/.test(char)
}

export function isNumberChar(char: string) {
	return /\d/.test(char)
}
