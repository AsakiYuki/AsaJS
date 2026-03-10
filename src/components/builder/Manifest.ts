import path from "path"
import { storage } from "../../compiler/storage.js"
import { JsonBuilder } from "./JsonBuilder.js"
import { Header } from "../../types/components/manifest.js"

export class Manifest extends JsonBuilder {
	constructor(folder: string, format_version: number, header: Header) {
		const file = path.join(folder, "manifest.json")
		super(file)
		storage.set(file, this)
	}

	public toJSON() {}
}
