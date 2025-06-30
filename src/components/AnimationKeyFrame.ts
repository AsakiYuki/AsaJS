import { JsonBuilder } from "../compilers/generator/JsonBuilder";
import { ReadValue } from "../compilers/reader/ReadProperties";
import { Identifier } from "../types/components/Identifier";
import { AnimationKeyFrameInterface } from "../types/objects/Animation";
import { Class } from "./Class";

export class AnimationKeyFrame extends Class {
    private properties: AnimationKeyFrameInterface;

    constructor(keyFrame: AnimationKeyFrameInterface, private identifier: Identifier) {
        super()
        this.properties = keyFrame;
        if (this.properties.from) this.properties.from = ReadValue(this.properties.from);
        if (this.properties.to) this.properties.to = ReadValue(this.properties.to);
        JsonBuilder.registerElement(identifier.namespace || "", this);
    }

    getFullPath() {
        return this.identifier.name || "";
    }

    getUI() {
        return this.properties;
    }
}
