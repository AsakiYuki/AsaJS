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
		obfuscateStringName: false,
		allowRandomStringName: true,
		forceRandomStringLength: 16,
	},
	ui_analyzer: {
		enabled: false,
		generate_path: "src/modify",
		imports: [],
	},
}
