/**
 * Configuration object for the AsaJS build process.
 * @type {import('asajs/config.d.ts').Config}
 */
export const config = {
	packinfo: {
		name: "AsaJS",
		description: "Create your Minecraft JSON-UI resource packs using JavaScript.",
		version: [1, 0, 0],
	},
	compiler: {
		enabled: true,
		autoImport: true,
		autoEnable: true,
		importToPreview: false,
		obfuscateStringName: true,
		allowRandomStringName: true,
		forceRandomStringLength: 16,
	},
	binding_functions: {
		custom_abs: function (number) {
			const randomAbs = RandomBindingString(16)

			return {
				generate_bindings: [
					{
						source_property_name: `[ abs(${number}) ]`,
						target_property_name: randomAbs,
					},
				],
				return_value: randomAbs,
			}
		},
	},
}
