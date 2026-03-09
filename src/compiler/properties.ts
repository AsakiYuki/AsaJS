import { AnimationKeyframe } from "../components/ui/AnimationKeyframe.js"
import { AnimType } from "../types/ui/enums/AnimType.js"
import { BagBinding } from "../types/ui/enums/BagBinding.js"
import { KeyframeAnimationProperties } from "../types/ui/properties/element/Animation.js"
import { Binding } from "../types/ui/properties/value.js"

export function FormatProperties(properties: any) {
	const property_bag: Record<Binding, any> = {}

	for (const key in properties) {
		const value = properties[key]

		if (key.startsWith("#")) {
			property_bag[<Binding>key] = value
			delete properties[key]
		}

		if (key.startsWith("$")) {
			const [varName, varType] = key.split("|")
			if (!varType) break
			switch (varType) {
				case "d":
					properties[`${varName}|default`] = value
					delete properties[key]
					break

				case "default":
					break

				default:
					throw new Error("Invalid variable type")
			}
		}
	}

	if (properties.anchor) {
		properties.anchor_from = properties.anchor_to = properties.anchor
		delete properties.anchor
	}

	if (properties.fit_to_width) {
		properties["$fit_to_width"] = properties.fit_to_width
		delete properties.fit_to_width
	}

	if (Object.keys(property_bag).length) {
		if (properties.property_bag) {
			properties.property_bag = { ...property_bag, ...properties.property_bag }
		} else {
			properties.property_bag = property_bag
		}
	}

	return properties
}

export function FormatAnimationProperties(properties: KeyframeAnimationProperties<AnimType>) {
	if (properties.next instanceof AnimationKeyframe) {
		properties.next = `${properties.next}`
	}

	return properties
}
