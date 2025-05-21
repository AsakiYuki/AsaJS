import fs from "fs";
import AdmZip from "adm-zip";
import { SearchFiles } from "./generator/SearchFiles";

/**
 * Compresses the specified build directory into a `.mcpack` file.
 *
 * This function checks if a file named `Minecraft-UIBuild.mcpack` already exists and deletes it.
 * It then creates a new zip archive, adding files from the provided `buildPath` using the
 * `SearchFiles` generator. The resulting zip file is written as `Minecraft-UIBuild.mcpack`.
 *
 * @param {string} buildPath - The path to the directory containing the files to be compressed.
 *
 * @returns {void} - This function does not return any value.
 */
export function CompressPack(buildPath: string): void {
	if (fs.existsSync("Minecraft-UIBuild.mcpack"))
		fs.rmSync("Minecraft-UIBuild.mcpack");

	const zip = new AdmZip(undefined, {
		fs,
	});

	SearchFiles.forEach(buildPath, (path) => {
		const pathSplit = path.path.split("/");
		zip.addLocalFile(
			`${buildPath}/${path.path}`,
			pathSplit.length !== 1
				? pathSplit.slice(0, pathSplit.length - 1).join("/")
				: undefined
		);
	});

	zip.writeZip("Minecraft-UIBuild.mcpack");
}
