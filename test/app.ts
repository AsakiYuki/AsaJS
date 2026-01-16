import { Parser } from ".."

const { gen, out } = new Parser("new(#a + #b) >= #b").out()

console.log(gen, out)
