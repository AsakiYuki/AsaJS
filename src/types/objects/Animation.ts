import { AnimationTypes } from "../enums/AnimTypes";
import { EasingTypes } from "../enums/EasingTypes";
import { Float, Int } from "../values/Number";
import { Vector2, Vector3, Vector4 } from "../values/Vector";

export interface AnimationInterface {
    from: Float | Vector2 | Vector3 | Vector4;
    type: AnimationTypes;
    loop?: boolean;
    smartCycle?: boolean;
    durationPerKeyFrame?: number;
    defaultEase?: EasingTypes;
    keyFrames: Array<AnimationKey | Float>;
}

export interface AnimationKey {
    from?: Float | Vector2 | Vector3 | Vector4;
    to?: Float | Vector2 | Vector3 | Vector4;
    duration?: Float;
    easing?: EasingTypes;
    initial_uv?: Vector2;
    fps?: Int;
    frame_count?: Int;
    frame_step?: Float;
    reversible?: boolean;
    resettable?: boolean;
    scale_from_starting_alpha?: boolean;
    activated?: boolean;
    destroy_at_end?: string;
    play_event?: string;
    start_event?: string;
    end_event?: string;
    reset_event?: string;
}

export interface AnimationKeyFrameInterface extends AnimationKey {
    type: AnimationTypes;

    next?: string;
}
