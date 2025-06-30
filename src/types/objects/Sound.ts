import { Float } from "../values/Number";

export interface Sound {
    sound_path?: string;
    sound_name?: string;
    sound_volume?: Float;
    sound_pitch?: Float;
    min_seconds_between_plays?: Float;
}
