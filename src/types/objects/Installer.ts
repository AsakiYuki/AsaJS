import { Version, SemverString, UUID } from "./Manifest";

export interface GlobalResourcePacks {
    pack_id: UUID;
    subpack?: string;
    version: Version | SemverString;
}

export enum ResourcePack {
    Production = "resource_packs",
    Development = "development_resource_packs",
}

export enum BehaviorPack {
    Production = "behavior_packs",
    Development = "development_behavior_packs",
}

export enum SkinPack {
    Production = "skin_packs",
    Development = "development_skin_packs",
}

export enum Minecraft {
    Stable = "Microsoft.MinecraftUWP_8wekyb3d8bbwe",
    Preview = "Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe",
}

export interface ResourcePackInterface {
    installGame: Minecraft;
    installFolder: ResourcePack;
}
