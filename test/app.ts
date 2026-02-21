import { Anchor, Label, Modify } from ".."

const label = Label(
	{
		text: "Hello World from my Custom UI!",
		shadow: true,
		anchor: Anchor.TOP_MIDDLE,
		offset: [0, 10],
	},
	"test",
).addBindings({
	source_property_name: `[ custom_abs(#a) ]`,
	target_property_name: "#text",
})

Modify("start", "start_screen_content").insertChild(label)
