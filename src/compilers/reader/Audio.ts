import fs from "fs";
import { SearchFiles } from "../generator/SearchFiles";
import { spawnSync, execSync } from "child_process";
import { Log } from "../generator/Log";

export function FormatAudio() {
	const reg = /\.(mp3|m4a|mp4|mov|opus|acc|flac)$/;
	const files = SearchFiles.array(".bedrock", ".bedrock").filter((path) =>
		reg.test(path)
	);

	if (!files.length) return;

	try {
		spawnSync("ffmpeg", ["-version"], {
			stdio: ["ignore", "ignore", "ignore"],
		}).error;

		console.timeLog(
			"Compiler",
			">> Starting to convert all found audio files to WAV format"
		);

		for (const file of files) {
			const out = file.replace(reg, ".wav");
			execSync(`ffmpeg -i ${file} ${out}`, {
				stdio: "ignore",
			});
			fs.rmSync(file);

			console.timeLog(
				"Compiler",
				`>> Reformatting of ${file.replace(
					/^\.bedrock\//,
					""
				)} is complete.`
			);
		}

		console.timeLog(
			"Compiler",
			`>> Successfully reformatted ${files.length} audio file(s).`
		);
		console.log();
	} catch (error) {
		Log.warning(
			"You need to install 'ffmpeg' to your system environment variables to automatic convert all audio files to a format minecraft can read."
		);
		console.log();
	}
}
