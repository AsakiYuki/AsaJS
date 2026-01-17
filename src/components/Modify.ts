import { IntelliSense, Namespace, Element, VanillaType } from "../types/vanilla/intellisense.js"
import { paths } from "../types/vanilla/paths.js"
import { UI } from "./UI.js"

export function Modify<T extends Namespace, K extends Element<T>>(namespace: T, name: K) {
	// @ts-ignore -- TS cannot prove this, but runtime guarantees it
	return new UI<VanillaType<T, K>>(undefined, name, namespace, paths[namespace][name])
}
