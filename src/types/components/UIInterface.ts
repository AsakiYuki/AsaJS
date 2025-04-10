import { UI } from "../../components/UI";
import { Types } from "../enums/Types";
import { Properties } from "../objects/properties/Properties";
import { Identifier } from "./Identifier";

export interface UIInterface extends StaticUIInterface {
    type?: Types;
    extends?: string | Identifier | UI;
}

export interface StaticUIInterface extends ExtendInterface {
    properties?: Properties;
}

export interface ExtendInterface {
    name?: string;
    namespace?: string;
}
