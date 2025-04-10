import { ItemAuxID } from "../types/enums/ItemAuxID";
import { Class } from "./Class";

/**
 * Represents a collection of item-related utilities, extending from the `Class` class.
 * This class provides static methods for retrieving item IDs and auxiliary IDs based on item identifiers.
 *
 * @class Items
 * @extends Class
 */
export class Items extends Class {
	/**
	 * Retrieves the item ID from the given item identifier string.
	 * The ID is calculated by dividing the auxiliary ID by `65536`.
	 *
	 * @param {string} identification - The item identifier, potentially in the format of `minecraft:itemName` or `itemName`.
	 * @returns {number} The item ID extracted from the identification string.
	 * @static
	 */
	static getID(identification: string): number {
		return this.getAuxID(identification) / 65536;
	}

	/**
	 * Retrieves the auxiliary ID for the specified item identifier.
	 * If the identifier doesn't include a namespace, it defaults to `minecraft:`.
	 *
	 * @param {string} identification - The item identifier, potentially in the format of `minecraft:itemName` or `itemName`.
	 * @returns {number} The auxiliary ID for the item.
	 * @static
	 */
	static getAuxID(identification: string): number {
		// If the identifier doesn't contain a namespace, prepend "minecraft:"
		if (identification.split(":").length === 1)
			identification = `minecraft:${identification}`;

		// Return the corresponding auxiliary ID from the ItemAuxID enum
		return (<any>ItemAuxID)[identification];
	}
}
