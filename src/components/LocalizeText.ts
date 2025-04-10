import { StaticUIInterface } from "../types/components/UIInterface";
import { Label } from "../types/objects/elements/Label";
import { UI } from "./UI";

interface LocalizeTextInterface {
    [language: string]: {
        [key: string]: string;
    };
}

interface SetLocalizeTextInterface {
    [language: string]: string;
}

export const localizeText: LocalizeTextInterface = {};

export class LocalizeText {
    constructor(public key: string, value: string | SetLocalizeTextInterface) {
        if (typeof value === "string") {
            this.set({ en_US: value });
        } else {
            this.set(value);
        }
    }

    createLabel(properties?: Omit<Label, "text">, identifier?: StaticUIInterface) {
        const label = UI.label(properties, identifier);

        label.setProperties({
            text: this.key,
        });

        return label;
    }

    set(texts: SetLocalizeTextInterface) {
        for (const language in texts) {
            (localizeText[language] ||= {})[this.key] = texts[language];
        }
    }

    get() {
        return this.key;
    }

    static register(key: string, value: string | SetLocalizeTextInterface) {
        return new LocalizeText(key, value);
    }
}
