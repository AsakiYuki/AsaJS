import fs from "fs-extra";
import { SemverString, UUID, Version } from "./../types/objects/Manifest";
import { Save } from "./generator/Save";
import { UIBuilder } from "./generator/UIBuilder";
import { UIWriteJson } from "./PreCompile";
import { Configs } from "./Config";

/**
 * Represents the global resource packs configuration.
 *
 * This interface is used to define the basic structure of a resource pack
 * with an associated UUID and version, and an optional subpack.
 */
export interface GlobalResourcePacks {
    /**
     * The unique identifier (UUID) for the resource pack.
     */
    pack_id: UUID;

    /**
     * The optional subpack identifier associated with the resource pack.
     */
    subpack?: string;

    /**
     * The version of the resource pack.
     */
    version: Version | SemverString;
}

/**
 * Enum representing the folders where resource packs are located.
 */
export enum ResourcePack {
    /**
     * The folder for production resource packs.
     */
    Production = "resource_packs",

    /**
     * The folder for development resource packs.
     */
    Development = "development_resource_packs",
}

/**
 * Enum representing the folders where behavior packs are located.
 */
export enum BehaviorPack {
    /**
     * The folder for production behavior packs.
     */
    Production = "behavior_packs",

    /**
     * The folder for development behavior packs.
     */
    Development = "development_behavior_packs",
}

/**
 * Enum representing the folders where skin packs are located.
 */
export enum SkinPack {
    /**
     * The folder for production skin packs.
     */
    Production = "skin_packs",

    /**
     * The folder for development skin packs.
     */
    Development = "development_skin_packs",
}

/**
 * Enum representing the different versions of Minecraft.
 */
export enum Minecraft {
    /**
     * The stable version of Minecraft.
     */
    Stable = "Microsoft.MinecraftUWP_8wekyb3d8bbwe",

    /**
     * The preview version of Minecraft.
     */
    Preview = "Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe",
}

/**
 * Interface for the configuration of resource pack installation.
 * Defines the game version and folder type for the resource pack installation.
 */
export interface ResourcePackInterface {
    /**
     * The Minecraft game version where the resource pack will be installed.
     */
    installGame: Minecraft;

    /**
     * The folder where the resource pack will be installed (either production or development).
     */
    installFolder: ResourcePack;
}

/**
 * Class responsible for handling the installation, checking, and management of resource packs.
 */
export class ResourcePacks {
    /**
     * The path to the game folder in the local application data.
     */
    gamePath: string;

    /**
     * The path to the game data folder.
     */
    gameDataPath: string;

    /**
     * The path where the resource pack will be installed.
     */
    installPath: string;

    /**
     * The path to the global resource packs configuration file.
     */
    globalResoucePacksPath: string;

    /**
     * Constructs a new `ResourcePacks` instance.
     *
     * @param {ResourcePackInterface} data - The configuration object containing the Minecraft game version and folder type.
     */
    constructor(data: ResourcePackInterface) {
        const config = Configs.getConfig();

        if (config.installer.installPath && config.installer.customPath) {
            this.gamePath = config.installer.installPath;
        } else {
            if (process.env.LOCALAPPDATA) {
                this.gamePath = `${process.env.LOCALAPPDATA}/Packages/${data.installGame}/LocalState`;
            } else if (process.env.HOME) {
                this.gamePath = `${process.env.HOME}/.local/share/mcpelauncher`;
            } else {
                this.gamePath = "";
            }
        }

        this.gameDataPath = `${this.gamePath}/games/com.mojang`;
        this.installPath = `${this.gameDataPath}/${data.installFolder}`;
        this.globalResoucePacksPath = `${this.gameDataPath}/minecraftpe/global_resource_packs.json`;
    }

    /**
     * Checks if a resource pack with the specified UUID and version is already installed.
     *
     * @param {UUID} uuid - The UUID of the resource pack to check.
     * @param {Version | SemverString} version - The version of the resource pack to check.
     * @returns {boolean} - Returns `true` if the pack is installed, `false` otherwise.
     */
    isPackInstalled(uuid: UUID, version: Version | SemverString) {
        const globalResourcePacks: Array<GlobalResourcePacks> = fs.existsSync(
            this.globalResoucePacksPath
        )
            ? fs.readJsonSync(this.globalResoucePacksPath, "utf-8")
            : [];
        const versionIsArray = Array.isArray(version);
        if (versionIsArray) version = <SemverString>JSON.stringify(version);
        for (const packData of globalResourcePacks) {
            if (
                packData.pack_id === uuid &&
                (versionIsArray ? JSON.stringify(packData.version) : packData.version) === version
            )
                return true;
        }
        return false;
    }

    /**
     * Installs a resource pack if it is not already installed.
     *
     * @param {UUID} uuid - The UUID of the resource pack to install.
     * @param {Version | SemverString} version - The version of the resource pack to install.
     */
    installPack(uuid: UUID, version: Version | SemverString) {
        if (this.isPackInstalled(uuid, version)) return;
        const globalResourcePacks: Array<GlobalResourcePacks> = fs.existsSync(
            this.globalResoucePacksPath
        )
            ? fs.readJsonSync(this.globalResoucePacksPath, "utf-8")
            : [];

        fs.writeJsonSync(this.globalResoucePacksPath, [{
            pack_id: uuid,
            version,
        }, ...globalResourcePacks], "utf-8");
    }

    /**
     * Uninstalls a resource pack by removing its entry from the global resource packs list.
     *
     * @param {UUID} uuid - The UUID of the resource pack to uninstall.
     * @param {Version | SemverString} version - The version of the resource pack to uninstall.
     */
    uninstallPack(uuid: UUID, version: Version | SemverString) {
        const globalResourcePacks: Array<GlobalResourcePacks> = fs.existsSync(
            this.globalResoucePacksPath
        )
            ? fs.readJsonSync(this.globalResoucePacksPath, "utf-8")
            : [];
        const versionIsArray = Array.isArray(version);
        if (versionIsArray) version = <SemverString>JSON.stringify(version);
        let i = -1;
        for (const packData of globalResourcePacks) {
            i++;
            if (
                packData.pack_id === uuid &&
                (versionIsArray ? JSON.stringify(packData.version) : packData.version) === version
            ) {
                globalResourcePacks.splice(i, 1);
                break;
            }
        }
        fs.writeJsonSync(this.globalResoucePacksPath, globalResourcePacks);
    }

    /**
     * Retrieves the installation path for the resource pack.
     *
     * @returns {string} - The installation path for the resource pack.
     */
    getInstallPath() {
        return `${this.installPath}/${Save.getBuildID()}`;
    }

    /**
     * Creates a symbolic link for the resource pack to the `.minecraft` folder.
     *
     * This allows the game to recognize and use the installed resource pack.
     */
    packLink() {
        UIBuilder.delete(".minecraft");
        fs.createSymlinkSync(this.getInstallPath(), ".minecraft", "junction");
    }
}
