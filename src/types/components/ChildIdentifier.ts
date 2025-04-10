import { UI } from "../../components/UI";
import { Properties } from "../objects/properties/Properties";
import { Identifier } from "./Identifier";

export interface ChildIdentifier {
    name?: string;
    properties?: Properties;
    extend?: string | UI | Identifier;
}

export interface ChildElement {
    [key: string]: Properties | {};
}
