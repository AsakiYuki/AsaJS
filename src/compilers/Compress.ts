import fs from "fs";
import AdmZip from "adm-zip";
import { SearchFiles } from "./generator/SearchFiles";

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
