/**
 * Configuration object for the AsaJS build process.
 * @type {import('asajs/config.d.ts').Config}
 */
export const config = {
	packinfo: {
		name: "AsaJS",
		description: "Create your Minecraft JSON-UI resource packs using JavaScript.",
	},
	compiler: {
		enabled: true,
		linked: false,
	},
}
