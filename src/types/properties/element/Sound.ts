import { Value } from "../value.js"

export interface SoundProperties {
	sound_name?: Value<string>
	sound_volume?: Value<number>
	sound_pitch?: Value<number>
	min_seconds_between_plays?: Value<number>
	event_type?: Value<string>
	button_name?: Value<string>
}

export interface Sound {
	sound_name?: Value<string>
	sound_volume?: Value<number>
	sound_pitch?: Value<number>
	sounds?: Value<Array<SoundProperties>>
}
