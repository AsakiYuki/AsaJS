import { Orientation } from "../../enums/Orientation.js"
import { Value } from "../value.js"

export interface StackPanel {
	orientation?: Value<Orientation>
}
