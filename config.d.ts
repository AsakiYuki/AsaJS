import { BindingItem, Variable } from "./src/types/properties/value.ts"

export interface RetBindingValue {
	generate_bindings?: Array<{ source_property_name: string; target_property_name: string }>
	return_value: string
}

export interface Config {
	compiler?: {
		enabled?: boolean
		autoImport?: boolean
		importToPreview?: boolean
		autoEnable?: boolean
		gdkUserId?: string
		fixInventoryItemRenderer?: boolean
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
	binding_functions?: Record<string, (...args: string[]) => RetBindingValue>
}
