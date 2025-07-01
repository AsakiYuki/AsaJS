import { UUID } from "../types/objects/Manifest";
import { Class } from "./Class";
import { Configs } from "../compilers/Config";
import { Binding } from "../types/values/Binding";

const HEX: string[] = Array.from({ length: 256 }, (_, i) =>
    i.toString(16).toUpperCase().padStart(2, "0")
);
const CHARS = "0123456789abcdefghijklmnopqrstuvwxyz";

export class Random extends Class {
    private static namespaces?: string[];
    private static namespaceIndex = 0;

    private static _uiConfig?: ReturnType<typeof Configs.getConfig>["compiler"]["UI"];
    private static get uiConfig() {
        return (this._uiConfig ??= Configs.getConfig().compiler.UI);
    }

    private static get isObfuscate(): boolean {
        return Configs.getConfig().compiler.UI.obfuscateName;
    }

    private static _uniqueKey?: string;
    private static get uniqueKey() {
        return (this._uniqueKey ??= Random.genString(5, 16).toUpperCase());
    }

    private static get prefix() {
        return this.uniqueKey;
    }

    private static counter = { element: 0, animation: 0, binding: 0 };

    static genString(length: number, base: number = 32): string {
        const chars = CHARS.slice(0, base);
        const out = new Array<string>(length);

        try {
            const buffer = new Uint8Array(length);
            crypto.getRandomValues(buffer);
            for (let i = 0; i < length; i++) {
                out[i] = chars[buffer[i] % base];
            }
        } catch {
            for (let i = 0; i < length; i++) {
                out[i] = chars[Math.floor(Math.random() * base)];
            }
        }

        return out.join("");
    }

    static getName(length: number = Random.uiConfig.nameLength): string {
        if (Random.isObfuscate) return Random.genString(length);
        const counter = ++Random.counter.element;
        return `${Random.prefix}_ELEMENT_${counter.toString(16).toUpperCase()}`;
    }

    static getAnimationName(length: number = Random.uiConfig.nameLength): string {
        if (Random.isObfuscate) return Random.genString(length);
        const counter = ++Random.counter.animation;
        return `${Random.prefix}_ANIMATION_${counter.toString(16).toUpperCase()}`;
    }

    static getNamespace(): string {
        if (!Random.namespaces) {
            const { namespaceAmount, namespaceLength } = Random.uiConfig;
            Random.namespaces = Array.from({ length: namespaceAmount }, (_, index) =>
                Random.isObfuscate
                    ? Random.genString(namespaceLength)
                    : `${Random.prefix}_NAMESPACE_${(index + 1).toString(16).toUpperCase()}`
            );
        }
        const index = Random.namespaceIndex++ % Random.namespaces.length;
        return Random.namespaces[index];
    }

    static getUUID(): UUID {
        const b = Array.from({ length: 16 }, () => Math.floor(Math.random() * 256));
        return <UUID>(
            `${HEX[b[0]]}${HEX[b[1]]}${HEX[b[2]]}${HEX[b[3]]}-${HEX[b[4]]}${HEX[b[5]]}-${
                HEX[b[6]]
            }${HEX[b[7]]}-${HEX[b[8]]}${HEX[b[9]]}-${HEX[b[10]]}${HEX[b[11]]}${HEX[b[12]]}${
                HEX[b[13]]
            }${HEX[b[14]]}${HEX[b[15]]}`
        );
    }

    static bindingName(): Binding {
        if (Random.isObfuscate) return `#${Random.genString(Random.uiConfig.nameLength)}`;
        const counter = ++Random.counter.binding;
        return `#${Random.prefix}_BINDING_${counter.toString(16).toUpperCase()}`;
    }
}
