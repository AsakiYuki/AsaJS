import { Direction } from "readline";
import { Binding } from "../../values/Binding";
import { Int } from "../../values/Number";
import { Var } from "../../values/Variable";
import { Vector2 } from "../../values/Vector";
import { ElementPath } from "../../values/ElementPath";

export interface Grids {
    grid_dimensions?: Vector2;
    maximum_grid_items?: Int;
    grid_dimension_binding?: Binding;
    grid_rescaling_type?: Var | Direction;
    grid_fill_direction?: Var | Direction;
    grid_item_template?: ElementPath;
    precached_grid_item_count?: Int;
}
