import { config } from "../Configuration.js"
import { getUUID } from "./linker.js"

export const version = config.packinfo?.version || [4, 0, 0]

export async function genManifest() {
	const [uuid1, uuid2] = await getUUID()
	return JSON.stringify({
		format_version: 2,
		header: {
			name: config.packinfo?.name || "AsaJS",
			description:
				config.packinfo?.description || "Create your Minecraft JSON-UI resource packs using JavaScript.",
			uuid: uuid1,
			version,
			min_engine_version: [1, 21, 80],
		},
		modules: [
			{
				description: "This resource pack generate by AsaJS.",
				type: "resources",
				uuid: uuid2,
				version: version,
			},
		],
		subpacks: config.packinfo?.subpacks,
		metadata: config.packinfo?.metadata,
	})
}
