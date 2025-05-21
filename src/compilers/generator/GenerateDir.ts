import fs from "fs";

/**
 * Creates the necessary directories (folders) in the specified path before placing files in them.
 * This ensures that no errors occur due to missing directories.
 *
 * @param {string} installPath - The root installation path where the folders will be created.
 * @param {string} path - The relative folder path to be created within the `installPath`.
 *
 * @returns {void}
 *
 * @example
 * // Example usage:
 * // Generates the folder structure for "folder1/folder2" inside "/install/path".
 * GenerateDir("/install/path", "folder1/folder2");
 */
export function GenerateDir(installPath: string, path?: string): void {
    path = path ? `${installPath}/${path}` : installPath;

    if (!fs.existsSync(path)) {
        let lastPath = "";
        const folderPath = path.split("/") || [];
        folderPath.pop();
        for (const folder of folderPath) {
            if (!(folder === "" || fs.existsSync(`${lastPath}${folder}`)))
                fs.mkdirSync(`${lastPath}${folder}`);
            lastPath = `${lastPath}${folder}/`;
        }
    }
}
