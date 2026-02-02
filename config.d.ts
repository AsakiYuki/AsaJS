import { Variable } from "./src/types/properties/value.ts"

export interface Config {
	compiler?: {
		enabled?: boolean
		autoImport?: boolean
		importToPreview?: boolean
		autoEnable?: boolean
		gdkUserId?: string
	}
	packinfo?: {
		name?: string
		description?: string
		version?: [number, number, number]

		metadata?: {
			authors?: string[]
			license?: string
			url?: string
		}

		subpacks?: {
			folder_name?: string
			name?: string
			memory_performance_tier?: number
		}[]
	}
	global_variables?: Record<Variable, string>
}
