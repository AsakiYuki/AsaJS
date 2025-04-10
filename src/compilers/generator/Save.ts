import fs from "fs-extra";
import { Class } from "../../components/Class";
import { Random } from "../../components/Random";
import { UUID } from "../../types/objects/Manifest";
type ReturnValue = () => any;

/**
 * A utility class for handling save file creation and updates.
 *
 * @class Save
 */
export class Save extends Class {
    /**
     * Flag to track whether a save file has been created.
     *
     * @type {boolean}
     * @static
     */
    static isSaveCreated: boolean = false;

    /**
     * Creates a file or reads from an existing one.
     * If the save folder doesn't exist, it will be created.
     *
     * @param {string} path - The file path relative to the `.save` folder.
     * @param {ReturnValue} data - A function that returns data to be written to the file.
     * @param {Function} [write=fs.writeFileSync] - The function used to write data to the file.
     * @param {Function} [read=fs.readFileSync] - The function used to read data from the file.
     * @returns {string} The data from the file or the newly written data.
     * @static
     */
    static createFile(
        path: string,
        data: ReturnValue,
        write: Function = fs.writeFileSync,
        read: Function = fs.readFileSync
    ) {
        if (!Save.isSaveCreated && !fs.pathExistsSync(".save")) fs.mkdirSync(".save");
        Save.isSaveCreated = true;
        if (!fs.pathExistsSync(`.save/${path}`)) {
            const $ = data();
            write(`.save/${path}`, $, "utf-8");
            return $;
        } else return read(`.save/${path}`, "utf-8");
    }

    /**
     * Creates a JSON file or reads from an existing JSON file.
     *
     * @param {string} path - The file path relative to the `.save` folder.
     * @param {ReturnValue} data - A function that returns the data to be written to the JSON file.
     * @returns {Object} The data read from the JSON file or newly created JSON data.
     * @static
     */
    static createJson(path: string, data: ReturnValue) {
        return Save.createFile(path, data, fs.writeJsonSync, fs.readJsonSync);
    }

    /**
     * Updates a file by backing up the previous content and writing new data to it.
     *
     * @param {string} path - The file path relative to the `.save` folder.
     * @param {ReturnValue} data - A function that returns the new data to be written to the file.
     * @param {Function} [write=fs.writeFileSync] - The function used to write data to the file.
     * @param {Function} [read=fs.readFileSync] - The function used to read data from the file.
     * @returns {string} The previous content of the file before the update.
     * @static
     */
    static updateFile(
        path: string,
        data: ReturnValue,
        write: Function = fs.writeFileSync,
        read: Function = fs.readFileSync
    ) {
        if (!Save.isSaveCreated && !fs.pathExistsSync(".save")) fs.mkdirSync(".save");
        const backup = read(`.save/${path}`, "utf-8");
        write(`.save/${path}`, data());
        return backup;
    }

    /**
     * Updates a JSON file by backing up the previous content and writing new data to it.
     *
     * @param {string} path - The file path relative to the `.save` folder.
     * @param {ReturnValue} data - A function that returns the new data to be written to the JSON file.
     * @returns {Object} The previous content of the JSON file before the update.
     * @static
     */
    static updateJson(path: string, data: ReturnValue) {
        return Save.updateFile(path, data, fs.readJsonSync, fs.readFileSync);
    }

    /**
     * Generates a pair of UUIDs.
     *
     * @returns {[UUID, UUID]} A tuple containing two UUIDs.
     * @static
     */
    static uuid(): [UUID, UUID] {
        return <[UUID, UUID]>Save.createJson("uuid", () => ({
            uuid: [Random.getUUID(), Random.getUUID()],
        })).uuid;
    }

    /**
     * Creates or retrieves resource configuration based on Minecraft version.
     *
     * @param {"stable" | "preview"} [mcVersion="stable"] - The Minecraft version type.
     * @returns {Object} The resource configuration.
     * @static
     */
    static resource(mcVersion: "stable" | "preview" = "stable") {
        return Save.createJson(`compile-${mcVersion}`, () => ({
            isDevelopment: true,
            folderName: Random.getName(),
        }));
    }

    /**
     * Retrieves or generates a build ID.
     *
     * @returns {string} The build ID.
     * @static
     */
    static getBuildID() {
        return Save.createJson("buildID", () => [Random.getName()])[0];
    }
}
