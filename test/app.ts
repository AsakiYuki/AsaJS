import { BagBinding, f, ItemAuxID, Label } from ".."

const text = Label({
	text: "#text",
	[BagBinding.ITEM_ID_AUX]: ItemAuxID.DIAMOND,
	"#x": 2,
})

text.addBindings({
	source_property_name: f(`Test: #{ -(${BagBinding.ITEM_ID_AUX} % #x) == 0 }`),
	target_property_name: BagBinding.TEXT,
})

console.log(text)
