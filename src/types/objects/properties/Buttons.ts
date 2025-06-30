import { Str } from "../../values/Str";
import { SliderBoxs } from "./SliderBoxs";

export interface Buttons extends SliderBoxs {
	pressed_control?: Str;
}
