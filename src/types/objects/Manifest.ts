export type FormatVerson = 1 | 2;
export type Version = [number, number, number];
export type SemverString =
    | `${number}.${number}.${number}`
    | `${number}.${number}.${number}-${number}`
    | `${number}.${number}.${number}+${number}`;

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export enum Type {
    Resources = "resources",
    Data = "data",
    WorldTemplate = "world_template",
    Script = "script",
}

export enum Language {
    JavaScript = "javascript",
}

export enum ModuleName {
    Server = "@minecraft/server",
    ServerUI = "@minecraft/server-ui",
    ServerGametest = "@minecraft/server-gametest",
    ServerNet = "@minecraft/server-net",
    ServerAdmin = "@minecraft/server-admin",
}

type Major = 1;
type Minor = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
type Patch = 0;
type PreRelease = "" | "-beta" | "-rc";

export type ScriptingVersion = `${Major}.${Minor}.${Patch}${PreRelease}`;

export interface Header {
    allow_random_seed?: boolean;
    base_game_version?: Version;
    description?: string;
    lock_template_options?: boolean;
    min_engine_version?: Version;
    name: string;
    pack_scope?: string;
    uuid: UUID;
    version: Version | SemverString;
}

export interface Modules {
    description?: string;
    type: Type;
    uuid: UUID;
    version: Version | SemverString;
    language?: Language;
}

export interface Dependencies {
    uuid?: UUID;
    module_name?: ModuleName;
    version?: Version | ScriptingVersion;
}

export interface CapabilitiesObject {
    chemistry?: any;
    editorExtension?: any;
    experimental_custom_ui?: any;
    raytraced?: any;
}

export enum Capabilities {
    ScriptEval = "script_eval",
}

export type Authors = Array<string>;

export interface Metadata {
    authors?: Authors;
    license?: string;
    generated_with?: object;
    product_type?: string;
    url?: string;
}
export interface ManifestInterface {
    format_version: FormatVerson;
    header: Header;
    modules: Modules[];
    dependencies?: Dependencies[];
    capabilities?: (CapabilitiesObject | Capabilities)[];
    metadata?: Metadata;
}
