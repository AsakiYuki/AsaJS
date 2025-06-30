import { Bool } from "../../values/Bool";
import { Int } from "../../values/Number";
import { Str } from "../../values/Str";

export interface TTS {
    tts_name?: Str;
    tts_control_header?: Str;
    tts_section_header?: Str;
    tts_control_type_order_priority?: Int;
    tts_index_priority?: Int;
    tts_toggle_on?: Str;
    tts_toggle_off?: Str;
    tts_override_control_value?: Str;
    tts_inherit_siblings?: Bool;
    tts_value_changed?: Str;
    ttsSectionContainer?: Bool;
    tts_ignore_count?: Bool;
    tts_skip_message?: Bool;
    tts_value_order_priority?: Int;
    tts_play_on_unchanged_focus_control?: Bool;
    tts_ignore_subsections?: Bool;
    text_tts?: Str;
    use_priority?: Bool;
    priority?: Bool;
}
