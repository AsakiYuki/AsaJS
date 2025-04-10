import { UUID } from "../types/objects/Manifest";
import { Class } from "./Class";
import { Configs } from "../compilers/Config";
import { Binding } from "../types/values/Binding";

/**
 * A utility class that provides random string and UUID generation functions.
 * This class includes methods for generating names, namespaces, and UUIDs for use in various applications.
 */
export class Random extends Class {
    /**
     * A cached array of namespaces that can be used in random generation.
     * @private
     */
    private static namespaces?: Array<string>;

    /**
     * Generates a random string of a specified length using base-32 characters.
     * The string is composed of random numbers from 0 to 31, which are then converted to base-32 representation.
     *
     * @param length The length of the random string to generate. Default is defined in the configuration.
     * @returns A random string of the specified length.
     */
    static getName(length: number = Configs.getConfig().compiler.UI.namespaceLength) {
        const randomStringArray: Array<string> = Array.from({ length }, v =>
            Math.floor(Math.random() * 32).toString(32)
        );
        return randomStringArray.join("");
    }

    /**
     * Generates a random namespace string by picking a random namespace from the cached list.
     * If the namespace list has not been generated, it is populated with random strings first.
     *
     * @param length The length of the random namespace to generate. Default is defined in the configuration.
     * @returns A random namespace string.
     */
    static getNamespace(length: number = Configs.getConfig().compiler.UI.namespaceLength) {
        if (Random.namespaces === undefined)
            Random.namespaces = Array.from(
                { length: Configs.getConfig().compiler.UI.namespaceAmount },
                () => Random.getName(length)
            );
        const randomIndex = Math.floor(
            Math.random() * Configs.getConfig().compiler.UI.namespaceAmount
        );
        return Random.namespaces[randomIndex];
    }

    /**
     * Generates a random UUID (Universally Unique Identifier).
     * The UUID is a standard 128-bit identifier represented as a string in the format `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`,
     * where each `x` is a random hexadecimal digit.
     *
     * @returns A randomly generated UUID string.
     */
    static getUUID(): UUID {
        return <UUID>(
            "$$$$$$$$-$$$$-$$$$-$$$$-$$$$$$$$$$$$".replaceAll(/\$/g, () =>
                Math.floor(Math.random() * 16).toString(16)
            )
        );
    }

    static bindingName(): Binding {
        return `#${Random.getName()}`;
    }
}
