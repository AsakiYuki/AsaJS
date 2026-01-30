import { Type } from "../types/enums/Type.js"
import { Array3, Binding, BindingItem } from "../types/properties/value.js"
import { ModifyUI, UI } from "./UI.js"

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
import { ItemAuxID } from "../types/enums/Items.js"
import { Element, Namespace, VanillaElementChilds, VanillaType } from "../types/vanilla/intellisense.js"
import { paths } from "../types/vanilla/paths.js"
import { isCompileBinding } from "../compilers/bindings/Checker.js"
import { Parser } from "../compilers/bindings/Parser.js"
import { BindingType } from "../types/enums/BindingType.js"
import { AnimType } from "../types/enums/AnimType.js"
import { AnimationKeyframe } from "./AnimationKeyframe.js"
import { AnimationProperties, KeyframeAnimationProperties } from "../types/properties/element/Animation.js"
import { Animation } from "./Animation.js"
import { SmartAnimation } from "../types/enums/SmartAnimation.js"
import { MemoryModify } from "../compilers/Memory.js"

type CompileBinding = `[${string}]`

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

export function ResolveBinding(...bindings: BindingItem[]) {
	const result: BindingItem[] = []

	for (const binding of bindings) {
		if (binding.source_property_name) {
			if (isCompileBinding(binding.source_property_name)) {
				const { gen, out } = new Parser(binding.source_property_name.slice(1, -1)).out()
				if (gen) result.push(...gen)
				binding.source_property_name = out
			}

			binding.binding_type = BindingType.VIEW

			if (!binding.target_property_name) throw new Error("Binding must have a target property name")
		}
		result.push(binding)
	}

	return result
}

export function RandomString(length: number, base: number = 32) {
	const chars = "0123456789abcdefghijklmnopqrstuvwxyz".slice(0, base)
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

export function RandomBindingString(length: number, base: number = 32): Binding {
	return `#${RandomString(length, base)}`
}

export function GetItemByAuxID(auxID: number) {
	const item = ItemAuxID[auxID]
	if (item) return `minecraft:${item.toLowerCase()}`
}

// Binding
/**
 * Return format string binding input
 * @param input
 * @returns {CompileBinding}
 */
export function f(input: string): CompileBinding {
	if (/^'.+'$/.test(input)) input = `f${input}`
	else if (!/^f'.+'$/.test(input)) input = `f'${input}'`
	return b(input)
}

/**
 * Return bracket binding input
 * @param input
 * @returns {CompileBinding}
 */
export function b(input: string): CompileBinding {
	return `[${input}]`
}

// Quick Elements
export function Modify<T extends Namespace, K extends Element<T>>(namespace: T, name: K) {
	// @ts-ignore
	const memoryUI = MemoryModify[paths[namespace][name]]?.[name]
	// @ts-ignore
	if (memoryUI) return memoryUI as ModifyUI<VanillaType<T, K>, VanillaElementChilds<T, K>>
	if (!paths[namespace]) {
		throw new Error(`Namespace '${namespace}' does not exist`)
		// @ts-ignore
	} else if (!paths[namespace][name]) {
		throw new Error(`Element '${name}' does not exist in namespace '${namespace}'`)
	}
	// @ts-ignore
	const modifyUI = new ModifyUI<VanillaType<T, K>, VanillaElementChilds<T, K>>(
		namespace,
		name,
		// @ts-ignore
		paths[namespace][name],
	)
	// @ts-ignore
	;(MemoryModify[paths[namespace][name]] ||= {})[name] = modifyUI

	return modifyUI
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

export function Gird(properties?: Grid, namespace?: string, name?: string) {
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

export function ExtendsOf<T extends Type, K extends Renderer | null>(
	element: UI<T, K>,
	properties?: Properties<T, K>,
	namespace?: string,
	name?: string,
) {
	if (!element.extendable) throw new Error("Cannot extend a UI that cannot be extended")
	const ui = new UI<T, K>(undefined, name, namespace)
	if (properties) ui.setProperties(properties)
	// @ts-ignore
	ui.extend = element
	// @ts-ignore
	ui.extendType = element.type || element.extendType
	return ui as typeof element
}

export function VanillaExtendsOf<T extends Namespace, K extends Exclude<Element<T>, `${string}/${string}`>>(
	originNamespace: T,
	originName: K,
	// @ts-ignore
	properties?: Properties<VanillaType<T, K>, null>,
	namespace?: string,
	name?: string,
) {
	// @ts-ignore
	const ui = new UI<VanillaType<T, K>, null>(undefined, name, namespace)
	if (properties) ui.setProperties(properties)
	// @ts-ignore
	ui.extend = {
		name: originName,
		namespace: originNamespace,
		toString: () => `@${originNamespace}.${originName}`,
	}

	return ui
}

// Quick Keyframe
export function OffsetKeyframe(
	properties?: KeyframeAnimationProperties<AnimType.OFFSET>,
	namespace?: string,
	name?: string,
) {
	return new AnimationKeyframe(AnimType.OFFSET, properties || {}, name, namespace)
}

export function SizeKeyframe(
	properties?: KeyframeAnimationProperties<AnimType.SIZE>,
	namespace?: string,
	name?: string,
) {
	return new AnimationKeyframe(AnimType.SIZE, properties || {}, name, namespace)
}

export function UVKeyframe(properties?: KeyframeAnimationProperties<AnimType.UV>, namespace?: string, name?: string) {
	return new AnimationKeyframe(AnimType.UV, properties || {}, name, namespace)
}

export function ClipKeyframe(
	properties?: KeyframeAnimationProperties<AnimType.CLIP>,
	namespace?: string,
	name?: string,
) {
	return new AnimationKeyframe(AnimType.CLIP, properties || {}, name, namespace)
}

export function ColorKeyframe(
	properties?: KeyframeAnimationProperties<AnimType.COLOR>,
	namespace?: string,
	name?: string,
) {
	return new AnimationKeyframe(AnimType.COLOR, properties || {}, name, namespace)
}

export function AlphaKeyframe(
	properties?: KeyframeAnimationProperties<AnimType.ALPHA>,
	namespace?: string,
	name?: string,
) {
	return new AnimationKeyframe(AnimType.ALPHA, properties || {}, name, namespace)
}

export function WaitKeyframe(
	properties?: KeyframeAnimationProperties<AnimType.WAIT>,
	namespace?: string,
	name?: string,
) {
	return new AnimationKeyframe(AnimType.WAIT, properties || {}, name, namespace)
}

export function FlipBookKeyframe(
	properties?: KeyframeAnimationProperties<AnimType.FLIP_BOOK>,
	namespace?: string,
	name?: string,
) {
	return new AnimationKeyframe(AnimType.FLIP_BOOK, properties || {}, name, namespace)
}

export function AsepriteFlipBookKeyframe(
	properties?: KeyframeAnimationProperties<AnimType.ASEPRITE_FLIP_BOOK>,
	namespace?: string,
	name?: string,
) {
	return new AnimationKeyframe(AnimType.ASEPRITE_FLIP_BOOK, properties || {}, name, namespace)
}

// Quick Animation
type Anim<T extends AnimType> = AnimationProperties<T> | number
type AnimWithSmartAnim<T extends AnimType> = [SmartAnimation | Anim<T>, ...Anim<T>[]]

export function OffsetAnimation(...keyframes: AnimWithSmartAnim<AnimType.OFFSET>) {
	return new Animation(AnimType.OFFSET, ...keyframes)
}

export function SizeAnimation(...keyframes: AnimWithSmartAnim<AnimType.SIZE>) {
	return new Animation(AnimType.SIZE, ...keyframes)
}

export function UVAnimation(...keyframes: AnimWithSmartAnim<AnimType.UV>) {
	return new Animation(AnimType.UV, ...keyframes)
}

export function ClipAnimation(...keyframes: AnimWithSmartAnim<AnimType.CLIP>) {
	return new Animation(AnimType.CLIP, ...keyframes)
}

export function ColorAnimation(...keyframes: AnimWithSmartAnim<AnimType.COLOR>) {
	return new Animation(AnimType.COLOR, ...keyframes)
}

export function AlphaAnimation(...keyframes: AnimWithSmartAnim<AnimType.ALPHA>) {
	return new Animation(AnimType.ALPHA, ...keyframes)
}

// Animation ExtendsOf
export function AnimationExtendsOf<T extends AnimType>(
	animation: AnimationKeyframe<T> | Animation<T>,
	properties?: AnimationProperties<T>,
) {
	const anim = new AnimationKeyframe(animation.type, properties || {})

	// @ts-ignore
	anim.extend = animation

	return anim
}
