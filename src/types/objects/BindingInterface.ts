import { BindingType } from "../enums/BindingType";
import { BindingName } from "../enums/BindingName";
import { Collection } from "../enums/Collection";
import { BindingCondition } from "../enums/BindingCondition";
import { Var } from "../values/Variable";
import { Binding } from "../values/Binding";
import { Bool } from "../values/Bool";
import { Str } from "../values/Str";

export interface BindingInterface {
    ignored?: Var | Bool;
    binding_type?: Var | BindingType;
    binding_name?: Var | BindingName;
    binding_name_override?: Var | BindingName | Str;
    binding_collection_name?: Var | Collection;
    binding_collection_prefix?: Var | Str;
    binding_condition?: Var | BindingCondition;
    source_control_name?: Var | Str;
    source_property_name?: Str | [Str];
    target_property_name?: Var | BindingName | Binding;
    resolve_sibling_scope?: Var | Bool;
}
