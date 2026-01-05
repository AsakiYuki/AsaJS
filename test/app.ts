import { Binding, Color, Label, Panel } from ".."

Panel({
	"#test": 123,
	[Binding.IS_CREATIVE_LAYOUT]: true,
	[Binding.INVENTORY_SELECTED_ITEM_COLOR]: Color(0x00ff00),
}).addChild(
	Label({
		text: "Hello, World!",
		shadow: true,
		color: Color("#3b0202"),
	})
)
