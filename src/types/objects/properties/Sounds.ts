import { Float } from "../../values/Number";
import { Str } from "../../values/Str";
import { Sound } from "../Sound";

export interface Sounds {
    sound_path?: string;
    sound_name?: Str;
    sound_volume?: Float;
    sound_pitch?: Float;
    sounds?: Array<Sound>;
}
