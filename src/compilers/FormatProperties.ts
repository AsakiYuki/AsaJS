import { Binding } from "../types/properties/value.js"

export function FormatProperties(properties: any) {
	const property_bags: Record<Binding, any> = {}

	for (const key in properties) {
		const value = properties[key]

		if (key.startsWith("#")) {
			property_bags[<Binding>key] = value
			delete properties[key]
		}
	}

	if (properties.anchor) {
		properties.anchor_from = properties.anchor_to = properties.anchor
		delete properties.anchor
	}

	if (Object.keys(property_bags))
		if (properties.property_bags) {
			properties.property_bags = { ...property_bags, ...properties.property_bags }
		} else {
			properties.property_bags = property_bags
		}

	return properties
}
