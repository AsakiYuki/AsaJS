import fs from "fs";
import { parse } from "jsonc-parser";
import { JsonBuilder } from "./JsonBuilder";
import { SearchFiles } from "./SearchFiles";
import { GenerateDir } from "./GenerateDir";
import { UIWriteJson } from "../PreCompile";

/**
 * A utility class for managing UI files, including deletion, generation, modification, and saving of UI-related data.
 *
 * @class UIBuilder
 */
export class UIBuilder {
    /**
     * Deletes a file or folder at the specified path.
     * If the path exists, it will be removed. If it is a file, it will be unlinked.
     * If it's a directory, it will be removed recursively.
     *
     * @param {string} installPath - The path to the file or folder to be deleted.
     * @returns {void}
     * @static
     */
    static delete(installPath: string): void {
        try {
            fs.unlinkSync(installPath);
        } catch (error) {
            if (fs.existsSync(installPath)) fs.rmSync(installPath, { recursive: true });
        }
    }

    /**
     * Generates JSON UI files based on the saved build data and writes them to the specified path.
     * The function logs the number of elements generated for each file.
     *
     * @param {string} installPath - The path where the generated JSON files will be saved.
     * @returns {number} The number of files that were generated.
     * @static
     */
    static jsonUI(installPath: string): number {
        const build = <any>JsonBuilder.save.build;
        let count = 0;
        for (const file in build) {
            const namespace = build[file].namespace;
            delete build[file].namespace;
            for (const jsonUI in build[file]) build[file][jsonUI] = build[file][jsonUI].getUI();

            console.timeLog(
                "COMPILER",
                `${file} ${Object.keys(build[file]).length} elements has generated!`
            );

            build[file].namespace = namespace;
            UIWriteJson(`${installPath}/@/${file}`, build[file], "utf-8");
            delete build[file];
            count++;
        }
        return count;
    }

    /**
     * Modifies UI files based on the saved modification data and writes them to the specified path.
     * It also creates necessary directories if they do not exist.
     *
     * @param {string} installPath - The path where the modified UI files will be saved.
     * @returns {number} The number of modified files generated.
     * @static
     */
    static modify(installPath: string): number {
        if (!fs.existsSync(`${installPath}/ui`)) fs.mkdirSync(`${installPath}/ui`);
        let count = 0;
        const modify = JsonBuilder.save.modify;
        for (const key in modify) {
            GenerateDir(installPath, key);
            for (const element in modify[key]) modify[key][element] = modify[key][element].getUI();

            console.timeLog(
                "COMPILER",
                `${key} ${Object.keys(modify[key]).length} modify element(s) has generated!`
            );

            UIWriteJson(`${installPath}/${key}`, modify[key], "utf-8");
            delete modify[key];
            count++;
        }
        return count;
    }

    /**
     * Generates a UI definitions file and writes it to the specified path.
     * The UI definitions are gathered from the specified folder and saved in `_ui_defs.json`.
     *
     * @param {string} installPath - The path where the UI definitions file will be saved.
     * @returns {number} The number of UI definitions that were generated.
     * @static
     */
    static uiDefs(installPath: string): number {
        const arr = SearchFiles.array(`${installPath}/@`, "@");
        UIWriteJson(`${installPath}/ui/_ui_defs.json`, { ui_defs: arr }, "utf-8");
        return arr.length;
    }

    /**
     * Generates a contents JSON file, listing all paths of files in the specified folder.
     *
     * @param {string} installPath - The path where the contents JSON file will be saved.
     * @returns {number} The number of files listed in the contents file.
     * @static
     */
    static contents(installPath: string): number {
        const arr = SearchFiles.array(installPath);

        UIWriteJson(
            `${installPath}/contents.json`,
            {
                content: arr.map(v => ({ path: v })),
            },
            "utf-8"
        );

        return arr.length;
    }

    /**
     * Generates a textures list and writes it to the specified path.
     * It filters out PNG, JPG, and JPEG files, adds them to a list, and then writes the list to `textures_list.json`.
     * It also merges the generated list with any existing textures list.
     *
     * @param {string} installPath - The path where the textures list will be saved.
     * @returns {number} The number of textures found and added to the list.
     * @static
     */
    static texturesList(installPath: string): number {
        const arr = SearchFiles.array(installPath)
            .filter(v => /\.(png|jpg|jpeg)$/.test(v))
            .map(v => v.replace(/\.(png|jpg|jpeg)$/, ""));

        let textureList: Array<string> = [];

        if (fs.existsSync(`.bedrock/textures/textures_list.json`)) {
            const texturesList = fs.readFileSync(`.bedrock/textures/textures_list.json`, "utf-8");
            textureList = parse(texturesList);
        }

        if (!fs.existsSync(`${installPath}/textures`)) fs.mkdirSync(`${installPath}/textures`);
        UIWriteJson(
            `${installPath}/textures/textures_list.json`,
            [...arr, ...textureList],
            "utf-8"
        );

        return arr.length;
    }

    /**
     * Generates a global variables file and writes it to the specified path.
     *
     * @param {string} installPath - The path where the global variables file will be saved.
     * @returns {number} The number of global variables written to the file.
     * @static
     */
    static globalVariables(installPath: string): number {
        const globalVariables = JsonBuilder.save.globalVariables;

        UIWriteJson(`${installPath}/ui/_global_variables.json`, globalVariables, "utf-8");

        return Object.keys(globalVariables).length;
    }
}
