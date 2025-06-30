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

export class JsonBuilder extends Class {
    static save: JsonObject = {
        build: {},
        globalVariables: {},
        modify: {},
    };

    static registerGlobalVariable(key: string, value: any): void {
        this.save.globalVariables[`$${key}`] = value;
    }

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

    static getModify(modifyFile: string, modifyElement: string): Modify {
        return this.save.modify[modifyFile]?.[modifyElement];
    }

    static registerModify(modifyFile: string, modifyElement: string, modify: Modify): Modify {
        const modifyFileSave = (this.save.modify[modifyFile] ??= {});
        return (modifyFileSave[modifyElement] = modify);
    }
}
