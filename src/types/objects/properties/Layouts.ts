import { Direction } from "readline";
import { Anchor } from "../../enums/Anchor";
import { Color } from "../../enums/EnumColor";
import { Bool } from "../../values/Bool";
import { StringVector2 } from "../../values/StringVector";
import { Float, Int } from "../../values/Number";
import { Var } from "../../values/Variable";
import { Str } from "../../values/Str";

export interface Layouts {
    size?: Str | Float | StringVector2;
    visible?: Bool;
    ignored?: Bool;
    layer?: Int;
    max_size?: Str | Float | StringVector2;
    min_size?: Str | Float | StringVector2;
    offset?: StringVector2;
    anchor?: Var | Anchor;
    anchor_from?: Var | Anchor;
    anchor_to?: Var | Anchor;
    inherit_max_sibling_width?: Bool;
    inherit_max_sibling_height?: Bool;
    use_anchored_offset?: Bool;
    contained?: Bool;
    draggable?: Var | Direction;
    follows_cursor?: Bool;
    debug?: Var | Color;
    min_w?: Float | Str;
    min_h?: Float | Str;
    max_w?: Float | Str;
    max_h?: Float | Str;
    w?: Float | Str;
    h?: Float | Str;
    x?: Float | Str;
    y?: Float | Str;
}
