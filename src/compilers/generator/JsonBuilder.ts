import { AnimationKeyFrame } from "../../components/AnimationKeyFrame";
import { Class } from "../../components/Class";
import { Modify } from "../../components/Modify";
import { UI } from "../../components/UI";
import { Configs } from "../Config";
import { CurrentLine } from "../reader/CurrentLine";
import { Log } from "./Log";

interface JsonObject {
    build: {
        [file: string]: {
            namespace: string;
            [element: string]: any;
        };
    };
    modify: {
        [modifyFilePath: string]: {
            [path: string]: Modify;
        };
    };
    globalVariables: {
        [key: `$${string}`]: any;
    };
}

/**
 * A utility class responsible for registering and processing JSON blocks, such as global variables, UI elements, and modifications to UI elements.
 * It provides functionality to register, modify, and retrieve elements that are later used for UI construction or modification.
 *
 * @class JsonBuilder
 */
export class JsonBuilder extends Class {
    /**
     * A static object that holds the state of saved JSON blocks.
     * - `build`: Contains the registered UI elements and animation keyframes.
     * - `globalVariables`: Contains global variables for the UI.
     * - `modify`: Contains elements that will be modified.
     *
     * @static
     * @type {JsonObject}
     */
    static save: JsonObject = {
        build: {},
        globalVariables: {},
        modify: {},
    };

    /**
     * Registers a global variable with a given key and value.
     * The global variable is stored in the `globalVariables` block under the specified key.
     *
     * @param {string} key - The key under which the global variable will be stored.
     * @param {any} value - The value of the global variable to be stored.
     * @returns {void}
     * @static
     */
    static registerGlobalVariable(key: string, value: any): void {
        this.save.globalVariables[`$${key}`] = value;
    }

    /**
     * Registers a UI element or animation keyframe under a specified namespace.
     * The element is stored in the `build` block, with its full path as the key and the element as the value.
     *
     * @param {string} namespace - The namespace under which the element will be registered.
     * @param {UI | AnimationKeyFrame} element - The UI element or animation keyframe to be registered.
     * @returns {void}
     * @static
     */
    static registerElement(namespace: string, element: UI | AnimationKeyFrame): void {
        const extension = Configs.getConfig().compiler.fileExtension;
        const buildFile = (this.save.build[
            `${namespace}${extension === "" ? "" : `.${extension}`}`
        ] ||= { namespace });

        for (const e in buildFile) {
            if (e.split("@")[0] === element.getFullPath().split("@")[0]) {
                Log.error(
                    `${CurrentLine()} element has a duplicate name and namespace, which can be override.`
                );
                break;
            }
        }

        buildFile[element.getFullPath()] = element;
    }

    /**
     * Retrieves a registered modify element from the `modify` block.
     * The modify element corresponds to a specific file and UI element that needs to be modified.
     *
     * @param {string} modifyFile - The name of the file that contains the modify element.
     * @param {string} modifyElement - The name of the UI element that will be modified.
     * @returns {Modify} The modify element that corresponds to the given file and element.
     * @static
     */
    static getModify(modifyFile: string, modifyElement: string): Modify {
        return this.save.modify[modifyFile]?.[modifyElement];
    }

    /**
     * Registers a UI element for modification. This element will be stored in the `modify` block under the specified file and element name.
     *
     * @param {string} modifyFile - The name of the file to be modified.
     * @param {string} modifyElement - The name of the UI element to be modified.
     * @param {Modify} modify - The modification data for the element.
     * @returns {Modify} The modified element that has been registered.
     * @static
     */
    static registerModify(modifyFile: string, modifyElement: string, modify: Modify): Modify {
        const modifyFileSave = (this.save.modify[modifyFile] ??= {});
        return (modifyFileSave[modifyElement] = modify);
    }
}
