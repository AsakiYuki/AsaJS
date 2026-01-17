import { Extends, GlobalVariables, Modify } from ".."

const vanilla = Modify("anvil_pocket", "slots_panel").setProperties({
	ignored: true,
})

console.log(vanilla.path)
