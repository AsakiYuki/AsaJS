import { AnimationKeyframe } from "../components/AnimationKeyframe.js"
import { AnimType } from "../types/enums/AnimType.js"
import { BagBinding } from "../types/enums/BagBinding.js"
import { KeyframeAnimationProperties } from "../types/properties/element/Animation.js"
import { Binding } from "../types/properties/value.js"
import { config } from "./Configuration.js"

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

	if (config.compiler?.fixInventoryItemRenderer && property_bag[BagBinding.ITEM_ID_AUX]) {
		property_bag[BagBinding.ITEM_ID_AUX] = `(${property_bag[BagBinding.ITEM_ID_AUX]} / 1)`
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
