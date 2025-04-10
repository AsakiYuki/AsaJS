import { UUID } from "crypto";
import { Save } from "./generator/Save";
import { Obj } from "./reader/Object";
import { firstRun } from "./generator/Template";
import { SemverString, Version } from "../types/objects/Manifest";

firstRun();

const defaultConfig: Config = {
    compiler: {
        encodeJson: false,
        autoCompress: false,
        fileExtension: "json",
        UI: {
            nameLength: 32,
            namespaceAmount: 16,
            namespaceLength: 32,
            obfuscateName: false,
            obfuscateType: false,
        },
    },
    installer: {
        autoInstall: true,
        developEvironment: true,
        previewVersion: false,
        customPath: false,
        installPath: undefined,
    },
    manifest: {
        name: "JsonUI Scripting",
        description: "Build with JsonUI Scripting <3",
        uuid: Save.uuid()[0],
        version: [1, 0, 0],
        baseGameVersion: [1, 21, 40],
    },
};

/**
 * Interface representing the structure of a config manifest.
 * This is used to define the metadata of the resource pack.
 */
interface ConfigManifest {
    name: string;
    description: string;
    version: Version | SemverString;
    baseGameVersion: Version;
    uuid: UUID;
}

interface ConfigCompilerUI {
    obfuscateName: boolean;
    obfuscateType: boolean;
    nameLength: number;
    namespaceLength: number;
    namespaceAmount: number;
}

interface ConfigCompiler {
    UI: ConfigCompilerUI;
    autoCompress: boolean;
    fileExtension: string;
    encodeJson: boolean;
}

interface ConfigInstaller {
    autoInstall: boolean;
    developEvironment: boolean;
    previewVersion: boolean;
    customPath: boolean;
    installPath?: string;
}

export interface Config {
    installer: ConfigInstaller;
    compiler: ConfigCompiler;
    manifest: ConfigManifest;
}

/**
 * Reads an object and applies default values where necessary.
 *
 * This function allows deeply nested objects to be filled with default values when they are undefined.
 *
 * @param {object} [obj] - The object to read and apply the default values to.
 * @param {object} [defaultObjValue] - The default values to use if any properties in `obj` are undefined.
 * @returns {object} - The object with default values applied.
 */
export function readObject(obj?: object, defaultObjValue?: object) {
    if (Array.isArray(defaultObjValue)) {
        if (!obj) obj = [];
        defaultObjValue.forEach((value, index) => {
            (<any>obj)[index] = (<any>obj)[index] ?? value;
        });
        return obj;
    } else {
        if (!obj) obj = {};
        Obj.forEach(defaultObjValue || {}, (key, value) => {
            if (typeof value === "object") {
                (<any>obj)[key] = readObject((<any>obj)[key], (<any>defaultObjValue)[key]);
            } else {
                (<any>obj)[key] = (<any>obj)[key] ?? (<any>defaultObjValue)[key];
            }
        });
        return obj;
    }
}

/**
 * A class to manage and load configuration settings.
 *
 * The class allows reading from a configuration file and merging the saved configuration
 * with default values when necessary.
 */
export class Configs {
    /**
     * The current loaded configuration saved to disk.
     */
    save: Config;

    /**
     * The statically cached configuration.
     */
    static config: Config;

    /**
     * Loads the configuration file and parses it into the `save` property.
     */
    constructor() {
        this.save = require(`${process.cwd()}/asakiyuki.config.cjs`).config;
    }

    /**
     * Retrieves the current configuration, either from the saved configuration or the default values.
     *
     * @returns {Config} - The configuration object.
     */
    static getConfig(): Config {
        if (Configs.config === undefined) {
            const defaultConfig = Configs.getDefaultConfig();
            const saveConfig = new Configs().save;
            return readObject(saveConfig, defaultConfig) as Config;
        } else return Configs.config;
    }

    /**
     * Retrieves the default configuration values.
     *
     * @returns {Config} - The default configuration object.
     */
    static getDefaultConfig(): Config {
        return defaultConfig;
    }

    // Static helper methods not directly related to config loading/handling.
    private static apply() {}
    private static arguments = "";
    private static bind() {}
    private static call() {}
    private static caller = "";
    private static length = "";
    private static name = "";
    private static toString() {}
}

/**
 * Exporting the Configs class to be used globally.
 *
 * This allows other modules to access the configuration settings through `config`.
 */
export const config = Configs;

Configs.getConfig();
