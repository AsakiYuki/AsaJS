import { getUUID } from "./linker.js"

export async function genManifest() {
	const [uuid1, uuid2] = await getUUID()
	return JSON.stringify({
		format_version: 2,
		header: {
			name: "AsaJS UI",
			uuid: uuid1,
			description: "A framework for creating UIs for AsaJS.",
			version: [4, 0, 0],
		},
		modules: [
			{
				type: "resources",
				uuid: uuid2,
				version: [4, 0, 0],
			},
		],
	})
}
