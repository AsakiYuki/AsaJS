import { Orientation } from "../../enums/Orientation";
import { Bool } from "../../values/Bool";
import { Float } from "../../values/Number";
import { Str } from "../../values/Str";
import { Var } from "../../values/Variable";

export interface Sliders {
    slider_track_button?: Str;
    slider_small_decrease_button?: Str;
    slider_small_increase_button?: Str;
    slider_steps?: Float;
    slider_direction?: Var | Orientation;
    slider_timeout?: Float;
    slider_collection_name?: Str;
    slider_name?: Str;
    slider_select_on_hover?: Bool;
    slider_selected_button?: Str;
    slider_deselected_button?: Str;
    slider_box_control?: Str;
    background_control?: Str;
    background_hover_control?: Str;
    progress_control?: Str;
    progress_hover_control?: Str;
}
