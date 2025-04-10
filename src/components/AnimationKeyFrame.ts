import { JsonBuilder } from "../compilers/generator/JsonBuilder";
import { ReadValue } from "../compilers/reader/ReadProperties";
import { Identifier } from "../types/components/Identifier";
import { AnimationKeyFrameInterface } from "../types/objects/Animation";

/**
 * Represents a keyframe in an animation, including its properties such as "from", "to", and other settings.
 * Handles the processing of the keyframe properties and registers it in the `JsonBuilder`.
 *
 * @class AnimationKeyFrame
 */
export class AnimationKeyFrame {
    private properties: AnimationKeyFrameInterface;

    /**
     * Creates an instance of the `AnimationKeyFrame` class and processes its properties.
     *
     * @param {AnimationKeyFrameInterface} keyFrame - The keyframe data, including the properties "from" and "to".
     * @param {Identifier} identifier - The identifier for the keyframe.
     * @constructor
     */
    constructor(keyFrame: AnimationKeyFrameInterface, private identifier: Identifier) {
        this.properties = keyFrame;
        if (this.properties.from) this.properties.from = ReadValue(this.properties.from);
        if (this.properties.to) this.properties.to = ReadValue(this.properties.to);
        JsonBuilder.registerElement(identifier.namespace || "", this);
    }

    /**
     * Retrieves the full path of the keyframe using its identifier.
     *
     * @returns {string} - The full path of the keyframe, represented by the identifier's name.
     */
    getFullPath() {
        return this.identifier.name || "";
    }

    /**
     * Retrieves the properties of the keyframe, including "from", "to", and other settings.
     *
     * @returns {AnimationKeyFrameInterface} - The properties of the keyframe.
     */
    getUI() {
        return this.properties;
    }

    /**
     * A static method that seems to serve as a placeholder, but has no functionality as of now.
     *
     * @private
     * @static
     */
    private static apply() {}

    /**
     * A static property initialized to an empty string, likely intended to hold arguments or be overridden in the future.
     *
     * @private
     * @static
     * @type {string}
     */
    private static arguments = "";

    /**
     * A static method that seems to serve as a placeholder, but has no functionality as of now.
     *
     * @private
     * @static
     */
    private static bind() {}

    /**
     * A static method that seems to serve as a placeholder, but has no functionality as of now.
     *
     * @private
     * @static
     */
    private static call() {}

    /**
     * A static property initialized to an empty string, likely intended to hold caller information or be overridden in the future.
     *
     * @private
     * @static
     * @type {string}
     */
    private static caller = "";

    /**
     * A static property initialized to an empty string, likely intended to hold length-related data or be overridden in the future.
     *
     * @private
     * @static
     * @type {string}
     */
    private static length = "";

    /**
     * A static property initialized to an empty string, likely intended to hold a name or be overridden in the future.
     *
     * @private
     * @static
     * @type {string}
     */
    private static name = "";

    /**
     * A static method that seems to serve as a placeholder, but has no functionality as of now.
     *
     * @private
     * @static
     */
    private static toString() {}
}
