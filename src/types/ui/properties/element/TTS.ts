import { Value } from "../value.js"

export interface TTS {
	tts_name?: Value<string>
	tts_control_header?: Value<string>
	tts_section_header?: Value<string>
	tts_control_type_order_priority?: Value<number>
	tts_index_priority?: Value<boolean>
	tts_toggle_on?: Value<string>
	tts_toggle_off?: Value<string>
	tts_override_control_value?: Value<string>
	tts_inherit_siblings?: Value<boolean>
	tts_value_changed?: Value<string>
	ttsSectionContainer?: Value<boolean>
	tts_ignore_count?: Value<boolean>
	tts_skip_message?: Value<boolean>
	tts_skip_children?: Value<boolean>
	tts_value_order_priority?: Value<number>
	tts_play_on_unchanged_focus_control?: Value<boolean>
	tts_ignore_subsections?: Value<boolean>
	text_tts?: Value<string>
	use_priority?: Value<boolean>
	priority?: Value<number>
}
