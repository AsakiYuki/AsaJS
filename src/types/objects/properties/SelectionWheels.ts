import { Float } from "../../values/Number";
import { Str } from "../../values/Str";
import { Var } from "../../values/Variable";

export interface SelectionWheels {
    inner_radius?: Float;
    outer_radius?: Float;
    state_controls?: Var | Array<string>;
    slice_count?: Float;
    button_name?: Str;
    iterate_left_button_name?: Str;
    iterate_right_button_name?: Str;
    initial_button_slice?: Float;
}
