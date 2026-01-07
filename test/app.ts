import { BindingTranspiler } from ".."

const input = "abcdef + 123456"

const lexer = BindingTranspiler.lexer(input)

console.log(lexer)
