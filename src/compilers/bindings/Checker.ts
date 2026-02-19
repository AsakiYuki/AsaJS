export function isBlankChar(char: string) {
	return /\s/.test(char)
}

export function isWordChar(char: string) {
	return char && /\w/.test(char)
}

export function isNumberChar(char: string) {
	return /\d/.test(char)
}

export function isHexChar(char: string) {
	return /[0-9a-fA-F]/.test(char)
}

export function isBinaryChar(char: string) {
	return /[01]/.test(char)
}

export function isOctalChar(char: string) {
	return /[0-7]/.test(char)
}

export function isCompileBinding(input: string) {
	return input.startsWith("[") && input.endsWith("]")
}

export function isHasBinding(input: string) {
	return /#\w+/.test(input)
}
