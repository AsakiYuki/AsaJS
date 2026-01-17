import { Namespace } from "../types/vanilla/elements.js"
import { IntelliSense } from "../types/vanilla/intellisense.js"
import { UI } from "./UI.js"

export function Modify<T extends Namespace>(namespace: T, name: IntelliSense[T]) {}
