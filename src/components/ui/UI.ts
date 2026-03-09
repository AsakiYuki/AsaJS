import path from "node:path"
import { Renderer } from "../../types/ui/enums/Renderer.js"
import { Type } from "../../types/ui/enums/Type.js"
import { GetRandomNamespace, GetRandomString } from "../../utils/Random.js"
import { UIInit } from "./UIInit.js"
import { GetUIStorage } from "../../compiler/ui/uistorage.js"

export class UI<T extends Type, R extends Renderer | null = null> extends UIInit<T, R> {
	protected readonly namespace: string

	constructor(
		private readonly type: T,
		name?: string,
		namespace?: string,
	) {
		super((name ||= GetRandomString()), path.join("ui", "build", (namespace ||= GetRandomNamespace())))
		GetUIStorage(namespace, this.file + ".json").add(name, this)
		this.namespace = namespace
	}

	toString(): string {
		return `@${this.namespace}.${this.name}`
	}

	toJSON() {
		return {
			type: this.type,
			...this.build(),
		}
	}
}
