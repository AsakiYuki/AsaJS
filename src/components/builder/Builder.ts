import path from "path"
import { storage } from "../../compiler/storage.js"

export abstract class Builder {
	public readonly path: string

	constructor(filepath: string) {
		this.path = path.join("build", filepath)
		storage.set(this.path, this)
	}

	public abstract build(): string
}
