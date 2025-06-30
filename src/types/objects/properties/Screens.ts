import { Bool } from "../../values/Bool";
import { StackPanels } from "./StackPanels";

export interface Screens extends StackPanels {
    render_only_when_topmost?: Bool;
    screen_not_flushable?: Bool;
    always_accepts_input?: Bool;
    render_game_behind?: Bool;
    absorbs_input?: Bool;
    is_showing_menu?: Bool;
    is_modal?: Bool;
    should_steal_mouse?: Bool;
    low_frequency_rendering?: Bool;
    screen_draws_last?: Bool;
    vr_mode?: Bool;
    force_render_below?: Bool;
    send_telemetry?: Bool;
    close_on_player_hurt?: Bool;
    cache_screen?: Bool;
    load_screen_immediately?: Bool;
    gamepad_cursor?: Bool;
    gamepad_cursor_deflection_mode?: Bool;
    should_be_skipped_during_automation?: Bool;
}
