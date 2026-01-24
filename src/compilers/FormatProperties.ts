import { Binding } from "../types/properties/value.js"

export function FormatProperties(properties: any) {
	const property_bag: Record<Binding, any> = {}

	for (const key in properties) {
		const value = properties[key]

		if (key.startsWith("#")) {
			property_bag[<Binding>key] = value
			delete properties[key]
		}
	}

	if (properties.anchor) {
		properties.anchor_from = properties.anchor_to = properties.anchor
		delete properties.anchor
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
