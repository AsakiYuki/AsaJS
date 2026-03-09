import { Value } from "../value.js"

export interface Screen {
	render_only_when_topmost?: Value<boolean>
	screen_not_flushable?: Value<boolean>
	always_accepts_input?: Value<boolean>
	render_game_behind?: Value<boolean>
	absorbs_input?: Value<boolean>
	is_showing_menu?: Value<boolean>
	is_modal?: Value<boolean>
	should_steal_mouse?: Value<boolean>
	low_frequency_rendering?: Value<boolean>
	screen_draws_last?: Value<boolean>
	vr_mode?: Value<boolean>
	force_render_below?: Value<boolean>
	send_telemetry?: Value<boolean>
	close_on_player_hurt?: Value<boolean>
	cache_screen?: Value<boolean>
	load_screen_immediately?: Value<boolean>
	gamepad_cursor?: Value<boolean>
	gamepad_cursor_deflection_mode?: Value<boolean>
	should_be_skipped_during_automation?: Value<boolean>
	use_custom_pocket_toast?: Value<boolean>
}
