import { Type } from "../types/enums/Type.js"
import { Array3 } from "../types/properties/value.js"
import { UI } from "./UI.js"

import { Renderer } from "../types/enums/Renderer.js"
import {
	Properties,
	CollectionPanel,
	Custom,
	Grid,
	Image,
	InputPanel,
	Label,
	Panel,
	Screen,
	StackPanel,
	TooltipTrigger,
	Button,
	Toggle,
	Dropdown,
	SelectionWheel,
	EditBox,
	ScrollbarBox,
	ScrollbarTrack,
	ScrollView,
	Slider,
	SliderBox,
} from "../types/properties/components.js"

const CHARS = "0123456789abcdefghijklmnopqrstuvwxyz"

export function Color(hex: string | number): Array3<number> {
	if (typeof hex === "number") {
		return [((hex >> 16) & 0xff) / 0xff, ((hex >> 8) & 0xff) / 0xff, (hex & 0xff) / 0xff]
	} else {
		if (hex.startsWith("#")) {
			if (hex.length === 7)
				return [
					parseInt(hex.slice(1, 3), 16) / 0xff,
					parseInt(hex.slice(3, 5), 16) / 0xff,
					parseInt(hex.slice(5, 7), 16) / 0xff,
				]
			if (hex.length === 4)
				return [
					parseInt(hex.slice(1, 2).repeat(2), 16) / 0xff,
					parseInt(hex.slice(2, 3).repeat(2), 16) / 0xff,
					parseInt(hex.slice(3, 4).repeat(2), 16) / 0xff,
				]

			console.error(`Invalid color: ${hex}`)
			process.exit(1)
		} else {
			console.error(`Invalid color: ${hex}`)
			process.exit(1)
		}
	}
}

export function RandomString(length: number, base: number = 32) {
	const chars = CHARS.slice(0, base)
	const out = new Array<string>(length)

	try {
		const buffer = new Uint8Array(length)
		crypto.getRandomValues(buffer)
		for (let i = 0; i < length; i++) {
			out[i] = chars[buffer[i] % base]
		}
	} catch {
		for (let i = 0; i < length; i++) {
			out[i] = chars[Math.floor(Math.random() * base)]
		}
	}

	return out.join("")
}

// Quick Elements
export function Panel(properties?: Panel, name?: string, namespace?: string) {
	return new UI(Type.PANEL, name, namespace).setProperties(properties || {})
}

export function CollectionPanel(properties?: CollectionPanel, name?: string, namespace?: string) {
	return new UI(Type.COLLECTION_PANEL, name, namespace).setProperties(properties || {})
}

export function StackPanel(properties?: StackPanel, name?: string, namespace?: string) {
	return new UI(Type.STACK_PANEL, name, namespace).setProperties(properties || {})
}

export function InputPanel(properties?: InputPanel, name?: string, namespace?: string) {
	return new UI(Type.INPUT_PANEL, name, namespace).setProperties(properties || {})
}

export function Gird(properties?: Grid, name?: string, namespace?: string) {
	return new UI(Type.GRID, name, namespace).setProperties(properties || {})
}

export function Screen(properties?: Screen, name?: string, namespace?: string) {
	return new UI(Type.SCREEN, name, namespace).setProperties(properties || {})
}

export function Image(properties?: Image, name?: string, namespace?: string) {
	return new UI(Type.IMAGE, name, namespace).setProperties(properties || {})
}

export function Label(properties?: Label, name?: string, namespace?: string) {
	return new UI(Type.LABEL, name, namespace).setProperties(properties || {})
}

export function Custom<R extends Renderer>(
	renderer: R,
	properties?: Properties<Type.CUSTOM, R>,
	name?: string,
	namespace?: string
) {
	const custom = new UI<Type.CUSTOM, R>(Type.CUSTOM, name, namespace)
	if (properties) custom.setProperties({ renderer, ...properties })
	return custom
}

export function TooltipTrigger(properties?: TooltipTrigger, name?: string, namespace?: string) {
	return new UI(Type.TOOLTIP_TRIGGER, name, namespace).setProperties(properties || {})
}

export function Button(properties?: Button, name?: string, namespace?: string) {
	return new UI(Type.BUTTON, name, namespace).setProperties(properties || {})
}

export function Toggle(properties?: Toggle, name?: string, namespace?: string) {
	return new UI(Type.TOGGLE, name, namespace).setProperties(properties || {})
}

export function Dropdown(properties?: Dropdown, name?: string, namespace?: string) {
	return new UI(Type.DROPDOWN, name, namespace).setProperties(properties || {})
}

export function SelectionWheel(properties?: SelectionWheel, name?: string, namespace?: string) {
	return new UI(Type.SELECTION_WHEEL, name, namespace).setProperties(properties || {})
}

export function EditBox(properties?: EditBox, name?: string, namespace?: string) {
	return new UI(Type.EDIT_BOX, name, namespace).setProperties(properties || {})
}

export function ScrollbarBox(properties?: ScrollbarBox, name?: string, namespace?: string) {
	return new UI(Type.SCROLLBAR_BOX, name, namespace).setProperties(properties || {})
}

export function ScrollbarTrack(properties?: ScrollbarTrack, name?: string, namespace?: string) {
	return new UI(Type.SCROLL_TRACK, name, namespace).setProperties(properties || {})
}

export function ScrollView(properties?: ScrollView, name?: string, namespace?: string) {
	return new UI(Type.SCROLL_VIEW, name, namespace).setProperties(properties || {})
}

export function Slider(properties?: Slider, name?: string, namespace?: string) {
	return new UI(Type.SLIDER, name, namespace).setProperties(properties || {})
}

export function SliderBox(properties?: SliderBox, name?: string, namespace?: string) {
	return new UI(Type.SLIDER_BOX, name, namespace).setProperties(properties || {})
}

export function Extends<T extends Type, K extends Renderer | null>(
	element: UI<T, K>,
	properties?: Properties<T, K>,
	name?: string,
	namespace?: string
) {
	const ui = new UI<T, K>(undefined, name, namespace)
	if (properties) ui.setProperties(properties)
	ui.extend = element
	return ui as typeof element
}
