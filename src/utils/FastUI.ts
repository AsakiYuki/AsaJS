import { FactoryManager } from "../components/ui/Factory.js"
import { UI } from "../components/ui/UI.js"
import { Renderer } from "../index.js"
import { Type } from "../types/ui/enums/Type.js"
import {
	Button,
	CollectionPanel,
	Dropdown,
	EditBox,
	Grid,
	Image,
	InputPanel,
	Label,
	Panel,
	Properties,
	Screen,
	ScrollbarBox,
	ScrollbarTrack,
	ScrollView,
	SelectionWheel,
	Slider,
	SliderBox,
	StackPanel,
	Toggle,
	TooltipTrigger,
} from "../types/ui/properties/components.js"

export function Factory(name: string) {
	return new FactoryManager(name)
}

export function Panel(properties?: Panel, namespace?: string, name?: string) {
	return new UI(Type.PANEL, name, namespace).setProperties(properties || {})
}

export function CollectionPanel(properties?: CollectionPanel, namespace?: string, name?: string) {
	return new UI(Type.COLLECTION_PANEL, name, namespace).setProperties(properties || {})
}

export function StackPanel(properties?: StackPanel, namespace?: string, name?: string) {
	return new UI(Type.STACK_PANEL, name, namespace).setProperties(properties || {})
}

export function InputPanel(properties?: InputPanel, namespace?: string, name?: string) {
	return new UI(Type.INPUT_PANEL, name, namespace).setProperties(properties || {})
}

export function Grid(properties?: Grid, namespace?: string, name?: string) {
	return new UI(Type.GRID, name, namespace).setProperties(properties || {})
}

export function Screen(properties?: Screen, namespace?: string, name?: string) {
	return new UI(Type.SCREEN, name, namespace).setProperties(properties || {})
}

export function Image(properties?: Image, namespace?: string, name?: string) {
	return new UI(Type.IMAGE, name, namespace).setProperties(properties || {})
}

export function Label(properties?: Label, namespace?: string, name?: string) {
	return new UI(Type.LABEL, name, namespace).setProperties(properties || {})
}

export function Custom<R extends Renderer>(
	renderer: R,
	properties?: Properties<Type.CUSTOM, R>,
	namespace?: string,
	name?: string,
) {
	const custom = new UI<Type.CUSTOM, R>(Type.CUSTOM, name, namespace)
	if (properties) custom.setProperties({ renderer, ...properties })
	return custom
}

export function TooltipTrigger(properties?: TooltipTrigger, namespace?: string, name?: string) {
	return new UI(Type.TOOLTIP_TRIGGER, name, namespace).setProperties(properties || {})
}

export function Button(properties?: Button, namespace?: string, name?: string) {
	return new UI(Type.BUTTON, name, namespace).setProperties(properties || {})
}

export function Toggle(properties?: Toggle, namespace?: string, name?: string) {
	return new UI(Type.TOGGLE, name, namespace).setProperties(properties || {})
}

export function Dropdown(properties?: Dropdown, namespace?: string, name?: string) {
	return new UI(Type.DROPDOWN, name, namespace).setProperties(properties || {})
}

export function SelectionWheel(properties?: SelectionWheel, namespace?: string, name?: string) {
	return new UI(Type.SELECTION_WHEEL, name, namespace).setProperties(properties || {})
}

export function EditBox(properties?: EditBox, namespace?: string, name?: string) {
	return new UI(Type.EDIT_BOX, name, namespace).setProperties(properties || {})
}

export function ScrollbarBox(properties?: ScrollbarBox, namespace?: string, name?: string) {
	return new UI(Type.SCROLLBAR_BOX, name, namespace).setProperties(properties || {})
}

export function ScrollbarTrack(properties?: ScrollbarTrack, namespace?: string, name?: string) {
	return new UI(Type.SCROLL_TRACK, name, namespace).setProperties(properties || {})
}

export function ScrollView(properties?: ScrollView, namespace?: string, name?: string) {
	return new UI(Type.SCROLL_VIEW, name, namespace).setProperties(properties || {})
}

export function Slider(properties?: Slider, namespace?: string, name?: string) {
	return new UI(Type.SLIDER, name, namespace).setProperties(properties || {})
}

export function SliderBox(properties?: SliderBox, namespace?: string, name?: string) {
	return new UI(Type.SLIDER_BOX, name, namespace).setProperties(properties || {})
}
