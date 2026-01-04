import { Anchor, Custom, Extends, GlobalVariables, Panel, Renderer, Type, UI } from ".."

const paperDoll = Custom(Renderer.PAPER_DOLL_RENDERER, {
	camera_tilt_degrees: 360,
	starting_rotation: 0,
})

const panel = Panel({
	anchor: Anchor.BOTTOM_LEFT,
	offset: [50, 50],
})
