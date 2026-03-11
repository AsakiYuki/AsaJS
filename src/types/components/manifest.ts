import { UUID } from "node:crypto"
import { Array3 } from "../ui/properties/value.js"

export type ManifestObject = {
	format_version: FormatVersion
	header: Header
	modules?: Module[]
	dependencies?: Dependencie[]
	capabilities?: Capabilitie[]
	metadata?: Metadata
	settings?: Setting[]
}

export type SemVer =
	| `${number}.${number}.${number}`
	| `${number}.${number}.${number}-${string}`
	| `${number}.${number}.${number}+${string}`
export type Version = SemVer | Array3<number>
export type FormatVersion = 1 | 2 | 3
export type ModuleType = "resources" | "data" | "world_template" | "script"
export enum ModuleLanguage {
	JAVASCRIPT = "javascript",
}
export type ModuleProductType = "addon"
export type MetadataGenerateWith = Record<string, Version[]>

export type DependencieModuleName =
	| "@minecraft/common"
	| "@minecraft/debug-utilities"
	| "@minecraft/server"
	| "@minecraft/server-ui"
	| "@minecraft/server-gametest"
	| "@minecraft/server-net"
	| "@minecraft/server-admin"
	| "@minecraft/server-editor-bindings"
	| "@minecraft/server-editor"

export const DependencieModuleUUID = {
	"@minecraft/common": "77ec12b4-1b2b-4c98-8d34-d1cd63f849d5",
	"@minecraft/debug-utilities": "1796ea86-0daf-4409-99ee-fd6467cf1203",
	"@minecraft/server": "b26a4d4c-afdf-4690-88f8-931846312678",
	"@minecraft/server-ui": "2bd50a27-ab5f-4f40-a596-3641627c635e",
	"@minecraft/server-gametest": "6f4b6893-1bb6-42fd-b458-7fa3d0c89616",
	"@minecraft/server-net": "777b1798-13a6-401c-9cba-0cf17e31a81b",
	"@minecraft/server-admin": "53d7f2bf-bf9c-49c4-ad1f-7c803d947920",
	"@minecraft/server-editor-bindings": "8518d9c7-a1f5-4bf3-acc7-78e87df595fc",
	"@minecraft/server-editor": "1d565354-296d-11ed-a261-0242ac120002",
} satisfies Record<DependencieModuleName, UUID>

export interface Header {
	name: string
	description: string
	version: Version
	uuid: string
	base_game_version?: Version
	min_engine_version?: Version
	allow_random_seed?: boolean
	lock_template_options?: boolean
	pack_scope?: string
}

export interface Module {
	type: ModuleType
	uuid: UUID
	version: Version
	description?: string
	language?: ModuleLanguage
}

export interface Dependencie {
	module_name: DependencieModuleName
	version: Version
	uuid?: UUID
}

export interface Capabilitie {
	chemistry?: any
	editorExtension?: any
	experimental_custom_ui?: any
	raytraced?: any
}

export interface Metadata {
	authors?: string[]
	license?: string
	generated_with?: MetadataGenerateWith
	product_type?: ModuleProductType
	url?: string
}

export type SettingTemplate = {
	text: string
}

export type LabelSetting = {
	type: "label"
} & SettingTemplate

export type ToggleSetting = {
	type: "toggle"
	name: string
	default: boolean
} & SettingTemplate

export type SliderSetting = {
	type: "slider"
	name: string
	min: number
	max: number
	step: number
	default: number
} & SettingTemplate

export type Setting = LabelSetting | ToggleSetting | SliderSetting
