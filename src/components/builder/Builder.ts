import path from "path"
import { storage } from "../../compiler/storage.js"

export abstract class Builder {
	constructor(public readonly path: string) {
		storage.set(this.path, this)
	}

	public abstract build(): string
}
