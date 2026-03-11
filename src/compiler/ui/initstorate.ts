import { JsonBuilder } from "../../components/builder/JsonBuilder.js"
import { AnimationKeyframe } from "../../components/ui/AnimationKeyframe.js"
import { UIInit } from "../../components/ui/UIInit.js"
import { AnimType } from "../../types/ui/enums/AnimType.js"
import { Renderer } from "../../types/ui/enums/Renderer.js"
import { Type } from "../../types/ui/enums/Type.js"
import path from "path"

export const storage = new Map<string, InitStorage>()

export abstract class InitStorage extends JsonBuilder {
	private uiMap = new Map<string, UIInit<Type, Renderer | null> | AnimationKeyframe<AnimType>>()

	constructor(public file: string) {
		file = path.join("resourcepack", file)
		super(file)
	}

	add(key: string, ui: UIInit<Type, Renderer | null> | AnimationKeyframe<AnimType>) {
		if (this.uiMap.has(key)) throw new Error("UI already exists")
		this.uiMap.set(key, ui)
	}

	protected get() {
		return Object.fromEntries(this.uiMap.entries())
	}

	abstract isUI: boolean
}
