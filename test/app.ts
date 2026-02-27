import { Label, Modify, Panel } from ".."

const panel = Panel()

panel.addChild(
	Label({
		text: "Hello World",
	}),
)

Modify("start", "start_screen_content").insertChild(panel).addBindings({})
