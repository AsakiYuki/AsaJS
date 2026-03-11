import { GetRandomUUID, Manifest } from ".."

new Manifest("resourcepack", 3, {
	name: "Hello World",
	uuid: GetRandomUUID(),
	version: [1, 0, 0],
	description: "",
}).addDependencies({
	module_name: "@minecraft/common",
	version: "1.1.1",
})
