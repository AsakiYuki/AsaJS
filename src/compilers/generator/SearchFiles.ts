import { Class } from "../../components/Class";
import fs from "fs-extra";

interface CallbackValue {
    folder?: string;
    file: string;
    path: string;
}

/**
 * Recursively searches for each file in a directory and executes a callback for each file found.
 *
 * @param {string} path - The path to the directory or file to start the search.
 * @param {(value: CallbackValue) => void} callback - A callback function to be called for each file found, with the file details passed as the parameter.
 * @param {string} [$1=""] - The current file or folder name in the recursive search.
 * @param {string} [$2=""] - The full path to the current file or folder.
 * @param {string} [$3=""] - The parent folder path, used for categorizing the current file in its folder.
 * @returns {void}
 */
function searchForEachFileRecursion(
    path: string,
    callback: (value: CallbackValue) => void,
    $1: string = "",
    $2: string = "",
    $3: string = ""
) {
    if (fs.statSync(path).isDirectory())
        for (const file of fs.readdirSync(path))
            searchForEachFileRecursion(
                `${path}/${file}`,
                callback,
                file,
                `${$2}/${file}`,
                $2.match(/(?<=\/)\w+$/)?.[0]
            );
    else
        callback({
            file: $1,
            folder: $3 === "" ? undefined : $3,
            path: $2.slice(1),
        });
}

/**
 * A class for searching and iterating over files within a folder.
 *
 * @class SearchFiles
 */
export class SearchFiles extends Class {
    /**
     * Retrieves an array of file paths within a folder.
     *
     * @param {string} folderPath - The folder path to search in.
     * @param {string} [prefix=""] - An optional prefix to be added to each file's path.
     * @returns {Array<string>} An array of file paths relative to the given folder.
     * @static
     */
    static array(folderPath: string, prefix?: string): Array<string> {
        const paths: Array<string> = [];
        SearchFiles.forEach(folderPath, value =>
            paths.push(`${prefix ? `${prefix}/` : ""}${value.path}`)
        );
        return paths;
    }

    /**
     * Executes a callback for each file in a given folder by recursively searching through the folder's contents.
     *
     * @param {string} folderPath - The folder path to search in.
     * @param {(value: CallbackValue) => void} callback - A callback function to be executed for each file found, with the file details passed as the parameter.
     * @static
     */
    static forEach(folderPath: string, callback: (value: CallbackValue) => void): void {
        searchForEachFileRecursion(folderPath, callback);
    }
}
