import { config } from "../Configuration.js"
import { getUUID } from "./linker.js"

export async function genManifest() {
	const [uuid1, uuid2] = await getUUID()
	return JSON.stringify({
		format_version: 2,
		header: {
			name: config.packinfo?.name || "AsaJS",
			description: config.packinfo?.description || "A framework for creating UIs for AsaJS.",
			uuid: uuid1,
			version: config.packinfo?.version || [4, 0, 0],
			min_engine_version: [1, 21, 132],
		},
		modules: [
			{
				description: "This resource pack generate by AsaJS.",
				type: "resources",
				uuid: uuid2,
				version: [4, 0, 0],
			},
		],
	})
}
