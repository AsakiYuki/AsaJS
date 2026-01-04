import { Anchor, Button, Custom, Extends, GlobalVariables, Panel, Renderer, Type, UI } from ".."

const paperDoll = Custom(Renderer.ANIMATED_GIF_RENDERER, {
	camera_tilt_degrees: 360,
	starting_rotation: 0,
})

const panel = Panel({
	anchor: Anchor.BOTTOM_LEFT,
	offset: [50, 50],
}).setProperties({
	camera_tilt_degrees: 360,
})

paperDoll.setProperties({
	camera_tilt_degrees: 360,
})

panel.setProperties({
	hover_control: "cac",
})
