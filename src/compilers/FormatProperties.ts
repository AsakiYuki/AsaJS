import { Type } from "../index.js"
import { Properties } from "../types/properties/components.js"

export function FormatProperties(properties: any) {
	if (properties.anchor) {
		properties.anchor_from = properties.anchor_to = properties.anchor
		delete properties.anchor
	}

	return properties
}
