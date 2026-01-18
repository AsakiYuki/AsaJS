import { Anchor, Modify, Properties } from ".."

const vanilla = Modify("authentication_modals", "ad_modal_dialog").setProperties({
	ignored: true,
	anchor: Anchor.CENTER,
	offset: [10, 10],
})

console.log(vanilla)
