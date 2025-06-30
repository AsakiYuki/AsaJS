import { LocalizeText } from "../../../components/LocalizeText";
import { Anchor } from "../../enums/Anchor";
import { FontSize } from "../../enums/FontSize";
import { FontType } from "../../enums/FontType";
import { Bool } from "../../values/Bool";
import { ColorVector3 } from "../../values/ColorVector";
import { Float } from "../../values/Number";
import { Str } from "../../values/Str";
import { Var } from "../../values/Variable";

export interface Texts {
    text?: Str | LocalizeText;
    color?: ColorVector3;
    locked_color?: ColorVector3;
    shadow?: Bool;
    hide_hyphen?: Bool;
    notify_on_ellipses?: Str | Array<string>;
    enable_profanity_filter?: Bool;
    locked_alpha?: Float;
    font_scale_factor?: Float;
    localize?: Bool;
    line_padding?: Float;
    font_size?: Var | FontSize;
    font_type?: Var | FontType;
    backup_font_type?: Var | FontType;
    text_alignment?: Var | Anchor;
}
