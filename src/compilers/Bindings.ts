import bindings from "bindings"
import { Token } from "./bindings/types.js"

export const {
	Lexer,
}: {
	Lexer: (input: string) => Token[]
} = bindings("asajs-compiler")
