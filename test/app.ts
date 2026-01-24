import { Panel } from ".."

const panel = Panel()

panel.addBindings({
	source_property_name: `[ $abc ]`,
	target_property_name: "#text",
})

console.log(panel)
