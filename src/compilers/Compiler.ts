import fs from "fs";
import { Manifest } from "./generator/Manifest";
import { UIBuilder } from "./generator/UIBuilder";
import { ResourcePacks, Minecraft, ResourcePack } from "./Installer";
import { Configs } from "./Config";
import { CompressPack } from "./Compress";
import { SoundHandler as Sounds } from "./generator/Sounds";
import { FormatAudio } from "./reader/Audio";
import { Logs } from "./generator/Log";
import { Encoder } from "./Encoder";
import { UIWriteJson } from "./PreCompile";
import { localizeText } from "../components/LocalizeText";
import { LangBuilder } from "./generator/LangBuilder";

const config = Configs.getConfig();

export const installer = new ResourcePacks({
    installGame: config.installer.previewVersion ? Minecraft.Preview : Minecraft.Stable,
    installFolder: config.installer.developEvironment
        ? ResourcePack.Development
        : ResourcePack.Production,
});

function manifestBuild(installPath: string): void {
    const { name, description, uuid, version, baseGameVersion } = config.manifest;
    const manifest = new Manifest({ name, description, uuid, version });
    manifest.manifest.header.min_engine_version = baseGameVersion;

    UIWriteJson(`${installPath}/manifest.json`, manifest.manifest, "utf-8");
}

let isRunned = false;
process.on("beforeExit", () => {
    if (isRunned) return;
    isRunned = true;

    const installPath = installer.getInstallPath();

    config.installer.autoInstall =
        config.installer.autoInstall && fs.existsSync(installer.installPath);

    const buildPath = config.installer.autoInstall ? installPath : ".build";

    // Clean up temporary build directories
    UIBuilder.delete(buildPath);
    if (fs.existsSync(".build")) fs.rmSync(".build", { recursive: true });
    if (fs.existsSync(".minecraft")) fs.unlinkSync(".minecraft");

    // Create necessary directories if they do not exist
    if (!fs.existsSync(`.bedrock`)) fs.mkdirSync(".bedrock");
    if (!fs.existsSync(`${buildPath}`)) fs.mkdirSync(`${buildPath}`);
    if (!fs.existsSync(`${buildPath}/@`)) fs.mkdirSync(`${buildPath}/@`);

    try {
        console.log("---------- COMPILING ----------");

        FormatAudio();

        // Perform actions depending on whether the build is within the project or external
        if (config.installer.autoInstall) {
            installer.packLink();
            console.timeLog("COMPILER", "Symlink completed!");
            console.log();
        }

        // Copy bedrock resources to build path
        fs.cpSync(".bedrock", buildPath, { recursive: true });
        console.timeLog("COMPILER", "Copy bedrock resources completed!");
        console.log();

        // Compile various UI files
        console.timeLog("COMPILER", `${UIBuilder.jsonUI(buildPath)} custom file(s) compiled!`);
        console.log();
        console.timeLog("COMPILER", `${UIBuilder.modify(buildPath)} modify file(s) compiled!`);
        console.log();
        if (Object.keys(localizeText).length) {
            console.timeLog("COMPILER", `${LangBuilder.build(buildPath)} lang file(s) compiled!`);
            console.log();
        }

        // Generate and save the manifest
        manifestBuild(buildPath);
        console.timeLog("COMPILER", `Manifest file has been compiled!`);

        // Compile UI and other required resources
        console.timeLog(
            "COMPILER",
            `ui/_ui_defs.json ${UIBuilder.uiDefs(buildPath)} files path(s) found!`
        );
        console.timeLog(
            "COMPILER",
            `ui/_global_variables.json ${UIBuilder.globalVariables(
                buildPath
            )} variable(s) compiled!`
        );
        console.timeLog(
            "COMPILER",
            `textures/textures_list.json ${UIBuilder.texturesList(buildPath)} files path(s) found!`
        );

        const soundLength = Sounds.compile(buildPath);
        if (soundLength)
            console.timeLog(
                "COMPILER",
                `sounds/sound_definitions.json ${soundLength} sound id has regisrer!`
            );

        console.timeLog(
            "COMPILER",
            `contents.json ${UIBuilder.contents(buildPath)} file path(s) found!`
        );

        // Install the resource pack if not building within the project
        if (config.installer.autoInstall) {
            installer.installPack(config.manifest.uuid, config.manifest.version);
            console.timeLog("COMPILER", `Resource Pack has been installed!`);
        }

        // Compress the pack if enabled in the config
        if (config.compiler.autoCompress) {
            CompressPack(buildPath);
            console.timeLog("COMPILER", "Minecraft-UIBuild.mcpack Pack compress completed!");
        }

        // Encode json code
        if (config.compiler.encodeJson) {
            Encoder.start();
            console.timeLog("COMPILER", `Encoded ${Encoder.count} JSON file(s) successfully!`);
        }

        // Final log of compilation completion
        console.log();
        console.timeLog("COMPILER", "Compile completed!");

        // Warning log
        if (Logs.length) {
            console.log("\n---------- Build Log ----------");

            for (const log of Logs) {
                if (log.type === "warning") console.warn(log.message);
                else if (log.type === "error") console.error(log.message);
            }
        }

        // Display relevant information
        console.log("\n---------- INFO ----------");
        console.log(`Name: \x1b[96m${config.manifest.name}\x1b[0m`);
        console.log(`Description: \x1b[96m${config.manifest.description}\x1b[0m`);
        console.log(`UUID: \x1b[96m${config.manifest.uuid}\x1b[0m`);
        console.log(
            `Pack Version: \x1b[96m${config.manifest.version[0]}.${config.manifest.version[1]}.${config.manifest.version[2]}\x1b[0m`
        );
        console.log(
            `Base Game Version: \x1b[96m${config.manifest.baseGameVersion[0]}.${config.manifest.baseGameVersion[1]}.${config.manifest.baseGameVersion[2]}\x1b[0m`
        );

        // Print install path if not building within the project
        if (config.installer.autoInstall)
            console.log(`Install Path: \x1b[96m${installPath}\x1b[0m`);
    } catch (error) {
        // Handle any errors during the compilation process
        console.timeLog("COMPILER", "An error occurred while compiling!");
        console.error(error);
    }
});

export { };
