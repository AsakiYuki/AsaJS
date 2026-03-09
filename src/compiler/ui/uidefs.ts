import path from "path"
import { JsonBuilder } from "../../components/builder/JsonBuilder.js"

export class UIDefs extends JsonBuilder {
	private static instance: UIDefs

	public static getInstance(): UIDefs {
		if (!UIDefs.instance) UIDefs.instance = new UIDefs()
		return UIDefs.instance
	}

	protected set = new Set<string>()

	constructor() {
		super(path.join("resoucepack", "ui", "ui_defs.json"))
	}

	add(filepath: string) {
		this.set.add(filepath.replaceAll("\\", "/"))
	}

	public toJSON() {
		return {
			_ui_defs: Array.from(this.set),
		}
	}
}
