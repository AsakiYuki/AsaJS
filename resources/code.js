import { Anchor, Label, Modify } from "asajs"

const label = Label({
	text: "Hello AsaJS!",
	anchor: Anchor.TOP_MIDDLE,
	offset: [0, 5],
	layer: 50,
	shadow: true,
})

Modify("start", "start_screen_content").insertChild(label)
