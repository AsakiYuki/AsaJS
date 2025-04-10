import { Class } from "../../components/Class";
import { Vector3, Vector4 } from "../../types/values/Vector";

/**
 * A utility class for parsing color values from hexadecimal strings into `Vector3` or `Vector4` formats.
 * The `parse` method interprets hex color strings with different lengths (3, 6, 4, or 8 characters)
 * and returns the corresponding normalized color values as either a `Vector3` (RGB) or `Vector4` (RGBA).
 *
 * @class ColorHandler
 */
export class ColorHandler extends Class {
    /**
     * Parses a hexadecimal color string and returns a normalized color vector.
     *
     * The method supports:
     * - 3-character hexadecimal color (e.g., "#rgb" → Vector3)
     * - 6-character hexadecimal color (e.g., "#rrggbb" → Vector3)
     * - 4-character RGBA color (e.g., "#rgba" → Vector4)
     * - 8-character RGBA color (e.g., "#aarrggbb" → Vector4)
     *
     * @param {string} data - The hexadecimal color string to parse, possibly prefixed with '#'.
     * @returns {Vector3 | Vector4 | null} A normalized `Vector3` (RGB) or `Vector4` (RGBA) or `null` if the input is invalid.
     *
     * @example
     * // Example usage:
     * const rgb = ColorHandler.parse("#ff5733"); // Returns Vector3 [1, 0.341, 0.2]
     * const rgba = ColorHandler.parse("#ff5733cc"); // Returns Vector4 [1, 0.341, 0.2, 0.8]
     */
    static parse(data: string): Vector3 | Vector4 | null {
        if (data.startsWith("#")) data = data.slice(1);

        try {
            const color = parseInt(data, 16);
            switch (data.length) {
                case 3:
                    return [((color >> 8) & 15) / 15, ((color >> 4) & 15) / 15, (color & 15) / 15];
                case 6:
                    return [
                        ((color >> 16) & 255) / 255,
                        ((color >> 8) & 255) / 255,
                        (color & 255) / 255,
                    ];
                case 4:
                    return [
                        ((color >> 16) & 15) / 15,
                        ((color >> 8) & 15) / 15,
                        ((color >> 4) & 15) / 15,
                        (color & 15) / 15,
                    ];
                case 8:
                    return [
                        ((color >> 24) & 255) / 255,
                        ((color >> 16) & 255) / 255,
                        ((color >> 8) & 255) / 255,
                        (color & 255) / 255,
                    ];
                default:
                    return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
