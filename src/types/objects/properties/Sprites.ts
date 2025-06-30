import { ClipDirection } from "../../enums/ClipDirecion";
import { FontType } from "../../enums/FontType";
import { TextureFileSystem } from "../../enums/TextureFileSystem";
import { Bool } from "../../values/Bool";
import { ColorVector3 } from "../../values/ColorVector";
import { Float, Int } from "../../values/Number";
import { Str } from "../../values/Str";
import { Var } from "../../values/Variable";
import { Vector2, Vector4 } from "../../values/Vector";

export interface Sprites {
    texture?: Str;
    allow_debug_missing_texture?: Bool;
    color?: ColorVector3;
    locked_color?: ColorVector3;
    uv?: Vector2;
    uv_size?: Vector2;
    texture_file_system?: Var | TextureFileSystem;
    nineslice_size?: Vector2 | Vector4 | Int;
    tiled?: Bool | Vector2;
    tiled_scale?: Vector2;
    clip_direction?: Var | ClipDirection;
    clip_ratio?: Float;
    clip_pixelperfect?: Bool;
    keep_ratio?: Bool;
    bilinear?: Bool;
    fill?: Bool;
    font_type?: Var | FontType;
    $fit_to_width?: Bool;
    zip_folder?: Str;
    grayscale?: Bool;
    force_texture_reload?: Bool;
    base_size?: Vector2;
}
