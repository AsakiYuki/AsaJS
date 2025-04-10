import { Animation } from "../../components/Animation";
import { LocalizeText } from "../../components/LocalizeText";
import { Properties } from "../../types/objects/properties/Properties";
import { Log } from "../generator/Log";
import { SoundHandler as Sounds } from "../generator/Sounds";
import { ColorHandler } from "./Color";
import { Obj } from "./Object";

/**
 * Processes a value and applies transformations based on its type.
 *
 * This function checks if the provided `value` is an array or an instance of `Animation` and handles it accordingly.
 * - If `value` is an array, it checks if the first element is a string and, if so, processes it as a color (using `ColorHandler.parse`) or as a variable (if it starts with `$`).
 * - If `value` is an instance of `Animation`, it returns the key index of the animation.
 *
 * @param {any} value - The value to process, which can be an array, an `Animation`, or any other type.
 * @param {((type: string) => any) | undefined} callback - An optional callback function that is called when a variable (`$`) is detected in the array.
 *
 * @returns {any} The processed value, which could be a parsed color, variable, or the original value.
 *
 * @example
 * // Example usage:
 * const color = ReadValue(["#FF5733"]);
 * console.log(color); // Parsed color array [1, 0.341, 0.2]
 *
 * const animationValue = ReadValue(new Animation());
 * console.log(animationValue); // Returns the key index of the animation
 */
export function ReadValue(value: any, callback?: (type: string) => any) {
    if (Array.isArray(value)) {
        if (typeof value[0] === "string") {
            if (value[0].startsWith("#") || value[0].startsWith("0x"))
                value = ColorHandler.parse(value[0]);
            else if (value[0].startsWith("$")) return callback?.("var");
        }
    } else if (value instanceof Animation) return value.getKeyIndex(0);
    else if (value instanceof LocalizeText) return value.get();

    return value;
}

/**
 * Processes and normalizes properties related to size, offset, and anchoring.
 *
 * This function takes a `properties` object and adjusts its properties to ensure consistency:
 * - It normalizes properties like `x`, `y`, `min_w`, `min_h`, `max_w`, `max_h`, and `w`, `h` into `offset` or `size` arrays.
 * - It processes properties that are not arrays (e.g., `min_size`, `max_size`) and converts them to arrays if necessary.
 * - It handles `anchor` properties and creates `anchor_from` and `anchor_to` properties.
 * - It also processes values for variables (denoted by `$`), modifying certain properties accordingly.
 *
 * @param {Properties} properties - The properties object to process, which may include size, offset, and other related values.
 *
 * @returns {Properties} The processed properties object with normalized size, offset, and anchoring information.
 *
 * @example
 * // Example usage:
 * const properties = { x: 10, y: 20, min_w: 100 };
 * const normalizedProperties = ReadProperties(properties);
 * console.log(normalizedProperties); // { offset: [10, 20], min_size: [100, 100] }
 */
export function ReadProperties(properties: Properties) {
    if (properties.x || properties.y) {
        properties.offset = [properties.x || 0, properties.y || 0];
        delete properties.x;
        delete properties.y;
    }

    if (properties.min_w || properties.min_h) {
        properties.min_size = [properties.min_w || 0, properties.min_h || 0];
        delete properties.min_w;
        delete properties.min_h;
    } else if (
        properties.min_size !== undefined &&
        !Array.isArray(properties.min_size) &&
        typeof properties.min_size === "string" &&
        !properties.min_size.startsWith("$")
    )
        (<any>properties.min_size) = [properties.min_size, properties.min_size];

    if (properties.max_w || properties.max_h) {
        properties.max_size = [properties.max_w || 0, properties.max_h || 0];
        delete properties.max_w;
        delete properties.max_h;
    } else if (
        properties.max_size !== undefined &&
        !Array.isArray(properties.max_size) &&
        typeof properties.max_size === "string" &&
        !properties.max_size.startsWith("$")
    )
        (<any>properties.max_size) = [properties.max_size, properties.max_size];

    if (properties.w || properties.h) {
        properties.size = [properties.w || 0, properties.h || 0];
        delete properties.w;
        delete properties.h;
    } else if (
        properties.size !== undefined &&
        !Array.isArray(properties.size) &&
        typeof properties.size === "string" &&
        !properties.size.startsWith("$")
    )
        (<any>properties.size) = [properties.size, properties.size];

    if (properties.sound_path) {
        properties.sound_name = Sounds.get(properties.sound_path);
        delete properties.sound_path;
    }

    if (properties.sounds) {
        properties.sounds = properties.sounds.map(sound => {
            if (sound.sound_path) {
                const soundId = Sounds.get(sound.sound_path);
                delete sound.sound_path;
                return {
                    sound_name: soundId,
                };
            } else return sound;
        });
    }

    Obj.forEach(properties, (key, value) => {
        if (key.startsWith("#")) {
            if (["string", "number", "boolean"].includes(typeof value)) {
                (<any>(properties.property_bag ||= {}))[key] = value;
            } else Log.error(`Invalid value for property "${key}"`);
            delete (<any>properties)[key];
        } else {
            (<any>properties)[key] = ReadValue(value, type => {
                if (type === "var") {
                    const isSpecialProperty = ["size", "min_size", "max_size"].includes(key);

                    const disableDefault = value[2];
                    const propertyName = disableDefault ? value[0] : `${value[0]}|default`;

                    if (isSpecialProperty) {
                        if (Array.isArray(value[1])) properties[propertyName] = value[1];
                        else properties[propertyName] = [value[1], value[1]];
                    } else {
                        properties[propertyName] = ReadValue(value[1]);
                    }

                    return value[0];
                }
            });
        }
    });

    if (properties.anchor) {
        properties.anchor_from = properties.anchor;
        properties.anchor_to = properties.anchor;
        delete properties.anchor;
    }

    return properties;
}
