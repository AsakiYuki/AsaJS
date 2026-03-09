import { Builder } from "./Builder.js"

export abstract class JsonBuilder extends Builder {
	constructor(public readonly file: string) {
		super(file)
	}

	public build() {
		return JSON.stringify(this.toJSON())
	}

	public abstract toJSON(): any
}
