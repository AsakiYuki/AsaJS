import { Array3 } from "../ui/properties/value.js"

export type FormatVersion = 1 | 2 | 3

export interface Header {
	name: string
	description?: string
	version: Array3<number>
	uuid: string
	base_game_version?: Array3<number>
	min_engine_version?: Array3<number>
	allow_random_seed?: boolean
	lock_template_options?: boolean
	pack_scope?: string
}
