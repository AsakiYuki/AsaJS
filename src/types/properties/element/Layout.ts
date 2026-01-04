import { Anchor } from "../../enums/Anchor.js"
import { Value, AnimValue, Array2 } from "../value.js"

export interface Layout {
	offset?: AnimValue<Array2<number>>
	size?: AnimValue<Array2<number | string>>
	max_size?: AnimValue<Array2<number | string>>
	min_size?: AnimValue<Array2<number | string>>
	inherit_max_sibling_width?: Value<boolean>
	inherit_max_sibling_height?: Value<boolean>
	use_anchored_offset?: Value<boolean>
	anchor_from?: Value<string | Anchor>
	anchor_to?: Value<string | Anchor>
	anchor?: Value<string | Anchor>
}
