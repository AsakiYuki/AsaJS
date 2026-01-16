import { Parser, Panel } from ".."

const { gen, out } = new Parser("abs(#a)").out()

console.log(gen, out)
