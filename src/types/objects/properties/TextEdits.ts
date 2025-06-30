import { Collection } from "../../enums/Collection";
import { TextType } from "../../enums/TextTypes";
import { Bool } from "../../values/Bool";
import { Int } from "../../values/Number";
import { Str } from "../../values/Str";
import { Var } from "../../values/Variable";

export interface TextEdits {
    text_box_name?: Str;
    text_edit_box_grid_collection_name?: Var | Collection;
    constrain_to_rect?: Bool;
    enabled_newline?: Bool;
    text_type?: TextType;
    max_length?: Int;
    text_control?: Str;
    place_holder_control?: Str;
    can_be_deselected?: Bool;
    always_listening?: Bool;
    virtual_keyboard_buffer_control?: Str;
}
