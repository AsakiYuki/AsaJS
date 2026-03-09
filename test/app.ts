import { Animation, AnimType, ModifyUI, Type, UI } from ".."

const panel = new UI(Type.PANEL)

panel.addBindings({
	source_property_name: `[ f'#a + #b = #{ #a + #b }' ]`,
	target_property_name: "#test",
})

const startScreenContent = new ModifyUI("start", "start_screen_content", "ui/start_screen.json")

startScreenContent.insertChild(panel)

for (let i = 0; i < 100; i++) {
	panel.addAnimations(
		new Animation(
			AnimType.COLOR,
			"smooth_loop",
			{
				to: [1, 1, 1],
				duration: 1,
			},
			{
				to: [0, 0, 0],
			},
		),
	)
}
