import { Direction } from "readline";
import { Binding } from "../../values/Binding";
import { Int } from "../../values/Number";
import { Var } from "../../values/Variable";
import { Vector2 } from "../../values/Vector";
import { ElementPath } from "../../values/ElementPath";

/**
 * Represents the configuration options for a grid layout.
 * This interface defines properties for managing the dimensions, item arrangement, and behavior of a grid.
 */
export interface Grids {
    /**
     * Specifies the dimensions of the grid in terms of width and height.
     * The value is represented as a `Vector2`, where the `x` value represents the number of columns,
     * and the `y` value represents the number of rows.
     */
    grid_dimensions?: Vector2;

    /**
     * Specifies the maximum number of items allowed in the grid.
     * If the number of items exceeds this value, it may be handled according to the layout's rules.
     */
    maximum_grid_items?: Int;

    /**
     * Defines a binding for the grid's dimension. This allows dynamic control over the grid's size,
     * based on the bound value or condition.
     */
    grid_dimension_binding?: Binding;

    /**
     * Specifies the type of grid rescaling. This can be used to adjust the grid layout dynamically.
     * The value can be a variable or a specific direction (`Var` | `Direction`).
     */
    grid_rescaling_type?: Var | Direction;

    /**
     * Defines the direction in which the grid is filled with items. It can be set to a variable or a specific direction (`Var` | `Direction`).
     */
    grid_fill_direction?: Var | Direction;

    /**
     * Specifies a template for the grid items. This template is used to generate new items for the grid layout.
     * It is defined as an `ElementPath`, which points to an existing element or structure.
     */
    grid_item_template?: ElementPath;

    /**
     * Defines the number of grid items to be precached for faster performance.
     * This can be useful to optimize the rendering of grid items when dealing with large datasets.
     */
    precached_grid_item_count?: Int;
}
