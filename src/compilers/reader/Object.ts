import { Class } from "../../components/Class";

type CallbackObject = (key: string, value: any) => void;
type CallbackObjectMap = (key: string, value: any) => { key: string; value: any };

/**
 * A utility class for performing operations on objects.
 * Provides methods to iterate over object properties or transform them.
 *
 * @class Obj
 */
export class Obj extends Class {
    /**
     * Iterates over the properties of an object and applies a callback function to each key-value pair.
     *
     * @param {object} data - The object to iterate over.
     * @param {CallbackObject} callback - A function that will be called for each key-value pair.
     * The callback will receive the key and the corresponding value of the object.
     *
     * @returns {void}
     *
     * @example
     * // Example usage:
     * Obj.forEach({ a: 1, b: 2 }, (key, value) => {
     *     console.log(key, value);
     * });
     * // Output:
     * // a 1
     * // b 2
     */
    static forEach(data: object, callback: CallbackObject): void {
        for (const key in data) {
            const element = (<any>data)[key];
            callback(key, element);
        }
    }

    /**
     * Maps the properties of an object and returns a new object with modified key-value pairs.
     *
     * The callback function can change the key or value, and the resulting object will reflect these changes.
     *
     * @param {object} data - The object to transform.
     * @param {CallbackObjectMap} callback - A function that will be called for each key-value pair.
     * The callback must return an object with `key` and `value` properties to modify the object.
     *
     * @returns {object} - A new object with the transformed key-value pairs.
     *
     * @example
     * // Example usage:
     * const result = Obj.map({ a: 1, b: 2 }, (key, value) => {
     *     return { key: key.toUpperCase(), value: value * 2 };
     * });
     * console.log(result); // { A: 2, B: 4 }
     */
    static map(data: object, callback: CallbackObjectMap): object {
        for (const key in data) {
            const getdata = callback(key, (<any>data)[key]);
            delete (<any>data)[key];
            (<any>data)[getdata.key] = getdata.value;
        }
        return data;
    }
}
