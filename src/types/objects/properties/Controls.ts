import { Bool } from "../../values/Bool";
import { Int, RangeFloat } from "../../values/Number";
import { Str } from "../../values/Str";
import { Vector2 } from "../../values/Vector";
import { Factory } from "../Factory";
import { PropertyBag } from "../PropertyBag";

export interface Controls {
    visible?: Bool;
    enabled?: Bool;
    layer?: Int;
    alpha?: RangeFloat;
    propagate_alpha?: Bool;
    clips_children?: Bool;
    allow_clipping?: Bool;
    clip_offset?: Vector2;
    clip_state_change_event?: Str;
    enable_scissor_test?: Bool;
    property_bag?: PropertyBag;
    selected?: Bool;
    use_child_anchors?: Bool;
    disable_anim_fast_forward?: Bool;
    animation_reset_name?: Str;
    ignored?: Bool;
    grid_position?: Vector2;
    collection_index?: Int;
    factory?: Factory;
}
