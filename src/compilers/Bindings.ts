import bindings from "bindings"
import { Token } from "./bindings/types.js"

export const {
	Lexer,
	isBlankChar,
	isWordChar,
	isNumberChar,
}: {
	Lexer: (input: string) => Token[]
	isBlankChar: (char: string) => boolean
	isWordChar: (char: string) => boolean
	isNumberChar: (char: string) => boolean
} = bindings("asajs-compiler")
