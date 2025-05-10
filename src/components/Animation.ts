import { Configs } from "../compilers/Config";
import { Identifier } from "../types/components/Identifier";
import { AnimationTypes } from "../types/enums/AnimTypes";
import { AnimationInterface } from "../types/objects/Animation";
import { AnimationKeyFrame } from "./AnimationKeyFrame";
import { Random } from "./Random";

/**
 * Represents an animation, which includes a series of keyframes, type, and loop behavior.
 * Provides methods to build the animation and access keyframes.
 *
 * @class Animation
 */
export class Animation {
    private keyFrames: Array<string> = [];

    /**
     * Registers a new animation with an optional identifier.
     *
     * @param {AnimationInterface} animation - The animation data to be registered.
     * @param {Identifier} [identifier] - The optional identifier for the animation.
     * @returns {Animation} - The newly created animation instance.
     */
    static register(animation: AnimationInterface, identifier?: Identifier): Animation {
        return new Animation(animation, identifier);
    }

    /**
     * Creates an instance of the Animation class, initializing keyframes and setting up the animation.
     *
     * @param {AnimationInterface} animation - The animation data including the keyframes, type, and other settings.
     * @param {Identifier} [identifier] - The optional identifier for the animation.
     * @constructor
     */
    constructor(animation: AnimationInterface, identifier?: Identifier) {
        const config = Configs.getConfig();

        if (!(identifier && !config.compiler.UI.obfuscateName))
            identifier = {
                name: Random.getAnimationName(),
                namespace: Random.getNamespace(),
            };
        else {
            if (!identifier.name) identifier.name = Random.getAnimationName();
            if (!identifier.namespace) identifier.namespace = Random.getAnimationName();
        }

        this.buildAnimation(animation, identifier);
    }

    /**
     * Retrieves the key index for a given keyframe index, ensuring the index is within valid bounds.
     *
     * @param {number} index - The index of the keyframe.
     * @returns {string} - The formatted key for the given index.
     */
    getKeyIndex(index: number): string {
        let i = index < 0 ? 0 : Math.min(index, this.keyFrames.length);
        return `@${this.keyFrames[index]}`;
    }

    /**
     * Builds the animation by processing the keyframes and creating animation keyframes.
     *
     * @param {AnimationInterface} animation - The animation data, including from, keyframes, loop, and type.
     * @param {Identifier} identifier - The identifier for the animation, including name and namespace.
     * @private
     */
    private buildAnimation(
        { from, keyFrames, loop, type, durationPerKeyFrame = 1 }: AnimationInterface,
        identifier: Identifier
    ) {
        const frameLength = keyFrames.length - 1;

        keyFrames.forEach((keyFrame, index) => {
            this.keyFrames.push(`${identifier.namespace}.${identifier.name}`);
            const currentIdentifier = identifier;

            let next;

            if (index === frameLength) {
                if (loop) next = this.getKeyIndex(0);
            } else {
                identifier = this.generateIdentifier();
                next = this.getFrameKeyByIdentifier(identifier);
            }

            if (typeof keyFrame == "number") {
                new AnimationKeyFrame(
                    <any>{
                        next,
                        anim_type: AnimationTypes.Wait,
                        duration: keyFrame,
                    },
                    currentIdentifier
                );
            } else {
                new AnimationKeyFrame(
                    <any>{
                        next,
                        anim_type: type,
                        from,
                        duration: (<any>keyFrame).duration ?? durationPerKeyFrame,
                        ...(<any>keyFrame),
                    },
                    currentIdentifier
                );
            }

            if (typeof keyFrame === "object") from = (<any>keyFrame).to;
        });
    }

    /**
     * Generates a new identifier with random name and namespace.
     *
     * @returns {Identifier} - A newly generated identifier with random name and namespace.
     * @private
     */
    private generateIdentifier() {
        return {
            name: Random.getAnimationName(),
            namespace: Random.getNamespace(),
        };
    }

    /**
     * Retrieves the frame key by the provided identifier in a formatted string.
     *
     * @param {Identifier} identifier - The identifier containing the namespace and name.
     * @returns {string} - The formatted key string based on the identifier.
     * @private
     */
    private getFrameKeyByIdentifier(identifier: Identifier) {
        return `@${identifier.namespace}.${identifier.name}`;
    }

    /**
     * A static method that seems to serve as a placeholder, but has no functionality as of now.
     *
     * @private
     * @static
     */
    private static apply() { }

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
    private static bind() { }

    /**
     * A static method that seems to serve as a placeholder, but has no functionality as of now.
     *
     * @private
     * @static
     */
    private static call() { }

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
    private static toString() { }
}
