import { Controls } from "../properties/Controls";
import { Layouts } from "../properties/Layouts";
import { Variables } from "../properties/Variables";
import { PropertyBag } from "../PropertyBag";

export interface Panel extends Variables, Controls, Layouts, PropertyBag {}
