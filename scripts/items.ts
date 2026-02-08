import fs from "fs"

const version = process.argv.includes("--preview") ? "preview" : "stable"

interface Item {
	id: number
	id_aux: number
	name: string
}

interface ItemAPI {
	version: string
	length: number
	items: Item[]
}

async function main() {
	const itemlist: string[] = ["export enum ItemAuxID {"]

	const { items }: ItemAPI = await fetch("https://www.asakiyuki.com/api/minecraft/items/id?version=" + version).then(
		v => v.json(),
	)
	for (const { name: fullname, id, id_aux } of items) {
		const [namespace, name] = fullname.split(":")
		const enumName = name.toUpperCase()
		itemlist.push(`    ${enumName} = ${id_aux},`)
	}

	itemlist.push("}")
	fs.writeFileSync("src/types/enums/Items.ts", itemlist.join("\n"))
}

main()
