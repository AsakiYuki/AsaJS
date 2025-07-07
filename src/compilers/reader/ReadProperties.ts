import { Animation } from "../../components/Animation";
import { LocalizeText } from "../../components/LocalizeText";
import { Modify } from "../../components/Modify";
import { UI } from "../../components/UI";
import { Properties } from "../../types/objects/properties/Properties";
import { Log } from "../generator/Log";
import { SoundHandler as Sounds } from "../generator/Sounds";
import { ColorHandler } from "./Color";
import { Obj } from "./Object";

export function ReadValue(value: any, callback?: (type: string) => any) {
    if (Array.isArray(value)) {
        if (typeof value[0] === "string") {
            if (value[0].startsWith("#") || value[0].startsWith("0x"))
                value = ColorHandler.parse(value[0]);
            else if (value[0].startsWith("$")) return callback?.("var");
        }
    } else if (value instanceof Animation) return value.getKeyIndex(0);
    else if (value instanceof LocalizeText) return value.get();
    else if (value instanceof UI || value instanceof Modify) return value.getPath();

    return value;
}

export function ReadProperties(properties: Properties) {
    if (properties.x || properties.y) {
        properties.offset = [properties.x || 0, properties.y || 0];
        delete properties.x;
        delete properties.y;
    }

    if (properties.min_w || properties.min_h) {
        properties.min_size = [properties.min_w || 0, properties.min_h || 0];
        delete properties.min_w;
        delete properties.min_h;
    } else if (
        properties.min_size !== undefined &&
        !Array.isArray(properties.min_size) &&
        ((typeof properties.min_size === "string" && !properties.min_size.startsWith("$")) ||
            typeof properties.min_size === "number")
    )
        (<any>properties.min_size) = [properties.min_size, properties.min_size];

    if (properties.max_w || properties.max_h) {
        properties.max_size = [properties.max_w || 0, properties.max_h || 0];
        delete properties.max_w;
        delete properties.max_h;
    } else if (
        properties.max_size !== undefined &&
        !Array.isArray(properties.max_size) &&
        ((typeof properties.max_size === "string" && !properties.max_size.startsWith("$")) ||
            typeof properties.max_size === "number")
    )
        (<any>properties.max_size) = [properties.max_size, properties.max_size];

    if (properties.w || properties.h) {
        properties.size = [properties.w || 0, properties.h || 0];
        delete properties.w;
        delete properties.h;
    } else if (
        properties.size !== undefined &&
        !Array.isArray(properties.size) &&
        ((typeof properties.size === "string" && !properties.size.startsWith("$")) ||
            typeof properties.size === "number")
    )
        (<any>properties.size) = [properties.size, properties.size];

    if (properties.sound_path) {
        properties.sound_name = Sounds.get(properties.sound_path);
        delete properties.sound_path;
    }

    if (properties.sounds) {
        properties.sounds = properties.sounds.map(sound => {
            if (sound.sound_path) {
                const soundId = Sounds.get(sound.sound_path);
                delete sound.sound_path;
                return {
                    sound_name: soundId,
                };
            } else return sound;
        });
    }

    Obj.forEach(properties, (key, value) => {
        if (key.startsWith("#")) {
            if (["string", "number", "boolean"].includes(typeof value)) {
                (<any>(properties.property_bag ||= {}))[key] = value;
            } else Log.error(`Invalid value for property "${key}"`);
            delete (<any>properties)[key];
        } else {
            (<any>properties)[key] = ReadValue(value, type => {
                if (type === "var") {
                    const isSpecialProperty = ["size", "min_size", "max_size"].includes(key);

                    const disableDefault = value[2];
                    const propertyName = disableDefault ? value[0] : `${value[0]}|default`;

                    if (isSpecialProperty) {
                        if (Array.isArray(value[1])) properties[propertyName] = value[1];
                        else properties[propertyName] = [value[1], value[1]];
                    } else {
                        properties[propertyName] = ReadValue(value[1]);
                    }

                    return value[0];
                }
            });
        }
    });

    if (properties.anchor) {
        properties.anchor_from = properties.anchor;
        properties.anchor_to = properties.anchor;
        delete properties.anchor;
    }

    return properties;
}
