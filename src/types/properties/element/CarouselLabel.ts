import { Array3, Value } from "../value.js"

export interface CarouselLabel {
	always_rotate?: Value<boolean>
	rotate_speed?: Value<number>
	hover_color?: Value<Array3<number>>
	hover_alpha?: Value<number>
	pressed_color?: Value<Array3<number>>
	pressed_alpha?: Value<number>
}
