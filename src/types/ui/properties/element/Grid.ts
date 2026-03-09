import { Array2, Binding, Value } from "../value.js"
import * as bind from "../../enums/Binding.js"
import { Orientation } from "../../enums/Orientation.js"

export interface Grid {
	grid_dimensions?: Value<Array2<number>>
	maximum_grid_items?: Value<number>
	grid_dimension_binding?: Value<Binding | bind.Binding>
	grid_rescaling_type?: Value<string | Orientation>
	grid_fill_direction?: Value<string | Orientation>
	precached_grid_item_count?: Value<number>
	grid_item_template?: Value<string>
}
