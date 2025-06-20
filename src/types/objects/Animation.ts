import { AnimationTypes } from "../enums/AnimTypes";
import { EasingTypes } from "../enums/EasingTypes";
import { Float, Int } from "../values/Number";
import { Vector2, Vector3, Vector4 } from "../values/Vector";

/**
 * Interface representing the main structure of an animation.
 */
export interface AnimationInterface {
    from: Float | Vector2 | Vector3 | Vector4;
    type: AnimationTypes;
    loop?: boolean;
    smartCycle?: boolean;
    durationPerKeyFrame?: number;
    defaultEase?: EasingTypes;
    keyFrames: Array<AnimationKey | Float>;
}

/**
 * Interface representing a single keyframe in an animation.
 */
export interface AnimationKey {
    /**
     * The starting value of the keyframe, which can be a float or a vector (2D, 3D, or 4D).
     */
    from?: Float | Vector2 | Vector3 | Vector4;

    /**
     * The ending value of the keyframe, which can be a float or a vector (2D, 3D, or 4D).
     */
    to?: Float | Vector2 | Vector3 | Vector4;

    /**
     * The duration of the keyframe, in seconds.
     */
    duration?: Float;

    /**
     * The easing function to use for the animation (e.g., ease-out, ease-in).
     */
    easing?: EasingTypes;

    /**
     * The initial UV coordinates for texture animations.
     */
    initial_uv?: Vector2;

    /**
     * The frames per second (FPS) for the animation.
     */
    fps?: Int;

    /**
     * The number of frames for the keyframe.
     */
    frame_count?: Int;

    /**
     * The frame step for the animation.
     */
    frame_step?: Float;

    /**
     * If true, the animation will reverse after reaching the end.
     * @default false
     */
    reversible?: boolean;

    /**
     * If true, the animation can be reset to its initial state.
     * @default false
     */
    resettable?: boolean;

    /**
     * If true, the animation's starting alpha will be scaled.
     * @default false
     */
    scale_from_starting_alpha?: boolean;

    /**
     * If true, the animation will be activated.
     * @default false
     */
    activated?: boolean;

    /**
     * Defines whether to destroy the object at the end of the animation.
     */
    destroy_at_end?: string;

    /**
     * The name of the event to trigger when the animation plays.
     */
    play_event?: string;

    /**
     * The name of the event to trigger when the animation starts.
     */
    start_event?: string;

    /**
     * The name of the event to trigger when the animation ends.
     */
    end_event?: string;

    /**
     * The name of the event to trigger when the animation resets.
     */
    reset_event?: string;
}

/**
 * Interface representing a keyframe in the animation, extending from AnimationKey with additional properties.
 */
export interface AnimationKeyFrameInterface extends AnimationKey {
    /**
     * The type of the animation (e.g., linear, ease-in, etc.).
     */
    type: AnimationTypes;

    /**
     * The name of the next keyframe to trigger, if applicable.
     */
    next?: string;
}
