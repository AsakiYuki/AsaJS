import { Lexer, Parser } from ".."

const { out } = new Parser("`A${`#a${#a + #b}`}A`").out()
console.log(out)
