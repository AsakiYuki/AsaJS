import { UUID } from "../types/objects/Manifest";
import { Class } from "./Class";
import { Configs } from "../compilers/Config";
import { Binding } from "../types/values/Binding";

export class Random extends Class {
    private static namespaces?: Array<string>;

    private static isObfuscate?: boolean;
    private static uniqueKey = Random.genString(5, 16).toUpperCase();
    private static counter = { element: 0, animation: 0, binding: 0 };

    private static genString(length: number, base: number = 32) {
        return Array.from({ length }, v => Math.floor(Math.random() * base).toString(base)).join("");
    }

    static getName(length: number = Configs.getConfig().compiler.UI.nameLength) {
        if (Random.isObfuscate ?? Configs.getConfig().compiler.UI.obfuscateName) return Random.genString(length);
        const counter = ++Random.counter.element;
        return `${Random.uniqueKey}_ELEMENT_${counter.toString(16).toUpperCase()}`;
    }

    static getAnimationName(length: number = Configs.getConfig().compiler.UI.nameLength) {
        if (Random.isObfuscate ?? Configs.getConfig().compiler.UI.obfuscateName) return Random.genString(length);
        const counter = ++Random.counter.animation;
        return `${Random.uniqueKey}_ANIMATION_${counter.toString(16).toUpperCase()}`;
    }

    static getNamespace() {
        if (!Random.namespaces) {
            Random.namespaces = Random.isObfuscate ?
                Array.from({ length: Configs.getConfig().compiler.UI.namespaceAmount }, () => Random.genString(Configs.getConfig().compiler.UI.namespaceLength)) :
                Array.from({ length: Configs.getConfig().compiler.UI.namespaceAmount }, ($, index) => `${Random.uniqueKey}_NAMESPACE_${(index + 1).toString(16).toUpperCase()}`);
        }

        const randomIndex = Math.floor(Math.random() * Random.namespaces.length);
        return Random.namespaces[randomIndex];
    }

    static getUUID(): UUID {
        return <UUID>(
            "$$$$$$$$-$$$$-$$$$-$$$$-$$$$$$$$$$$$".replaceAll(/\$/g, () =>
                Math.floor(Math.random() * 16).toString(16)
            )
        );
    }

    static bindingName(): Binding {
        if (Random.isObfuscate ?? Configs.getConfig().compiler.UI.obfuscateName) return `#${Random.getName()}`;
        const counter = ++Random.counter.binding;
        return `#${Random.uniqueKey}_BINDING_${counter.toString(16).toUpperCase()}`;
    }
}
