import { Variable } from "./src/types/properties/value.ts"

export interface Config {
	compiler?: {
		enabled?: boolean
		linked?: boolean
	}
	packinfo?: {
		name?: string
		description?: string
		version?: [number, number, number]
	}
	global_variables?: Record<Variable, string>
}
