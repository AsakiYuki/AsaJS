import { Controls } from "../properties/Controls";
import { Layouts } from "../properties/Layouts";
import { Variables } from "../properties/Variables";
import { BindingPropertyBag } from "../PropertyBag";

export interface Panel extends Variables, Controls, Layouts, BindingPropertyBag {}
