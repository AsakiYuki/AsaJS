import { Type } from "../types/enums/Type.js"
import { Array3, Binding, BindingItem, Variable } from "../types/properties/value.js"
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
import { Lexer } from "../compilers/bindings/Lexer.js"
import { Token, TokenKind, TSToken, TSTokenKind } from "../compilers/bindings/types.js"
import {
	allowRandomStringName,
	forceRandomStringLength,
	isNotObfuscate,
	namespaceCount,
} from "../compilers/Configuration.js"

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

export function ResolveBinding(cache: Map<string, unknown>, ...bindings: BindingItem[]) {
	const result: BindingItem[] = []

	for (const binding of bindings) {
		if (binding.source_property_name) {
			if (isCompileBinding(binding.source_property_name)) {
				const inputBindings = binding.source_property_name.slice(1, -1)
				if (binding.source_control_name) {
					// @ts-ignore
					const tokensMapping = (token: Token) => {
						if (token.kind === TokenKind.VARIABLE) {
							const mapkey = `mapping:${binding.source_control_name}:${token.value}`

							if (cache.has(mapkey)) {
								return {
									...token,
									value: cache.get(mapkey) as string,
								}
							} else {
								const ret = RandomBindingString()
								cache.set(mapkey, ret)

								result.push({
									source_property_name: token.value,
									source_control_name: binding.source_control_name,
									target_property_name: ret,
									binding_type: BindingType.VIEW,
								})

								return {
									...token,
									value: ret,
								}
							}
						} else if (token.kind === TokenKind.TEMPLATE_STRING) {
							return {
								...token,
								// @ts-ignore
								value: token.value.map((tstoken: TSToken) => {
									if (tstoken.kind === TSTokenKind.STRING) return tstoken
									else {
										return {
											...tstoken,
											tokens: tstoken.tokens.map(tokensMapping),
										}
									}
								}),
							}
						} else return token
					}

					const { gen, out } = new Parser(inputBindings, cache, Lexer(inputBindings).map(tokensMapping)).out()

					delete binding.source_control_name

					if (gen) result.push(...gen)
					binding.source_property_name = out
				} else {
					const { gen, out } = new Parser(inputBindings, cache).out()
					if (gen) result.push(...gen)
					binding.source_property_name = out
				}
			}
			binding.binding_type ||= BindingType.VIEW
			if (!binding.target_property_name) throw new Error("Binding must have a target property name")
		} else if (binding.binding_collection_name) {
			if (Object.keys(binding).length > 1) binding.binding_type ||= BindingType.COLLECTION
			else binding.binding_type ||= BindingType.COLLECTION_DETAILS
		}
		result.push(binding)
	}

	return result
}

export let defaultNamespace: string | null = null
export function SetDefaultNamespace(input: string) {
	defaultNamespace = input
}
export function ClearDefaultNamespace() {
	defaultNamespace = null
}

export function GenRandomString(length: number, base = 32) {
	const chars = "0123456789abcdefghijklmnopqrstuvwxyz".slice(0, base)
	const out = new Array<string>(length)
	if (forceRandomStringLength) length = forceRandomStringLength

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

const StringID = GenRandomString(5, undefined)
const nspl = allowRandomStringName
	? Array.from({ length: namespaceCount }, () => RandomString(16))
	: (() => {
			return Array.from({ length: namespaceCount }, (i, index) => `${StringID}_namespace_${index + 1}`)
		})()

export function RandomNamespace() {
	return nspl[Math.floor(Math.random() * nspl.length)]
}

let rndStr = 1
export function RandomString(length: number, base: number = 32, force?: boolean) {
	if (force || allowRandomStringName) return GenRandomString(length, base)
	else return `${StringID}_string_${rndStr++}`
}

let rndStrBind = 1
export function RandomBindingString(length: number = 16, base: number = 32, force?: boolean): Binding {
	if (force || allowRandomStringName) return `#${GenRandomString(length, base)}`
	else return `#${StringID}_binding_${rndStrBind++}`
}

let rndVarBind = 1
export function RandomVariableString(length: number = 16, base: number = 32, force?: boolean): Variable {
	if (force || allowRandomStringName) return `$${GenRandomString(length, base)}`
	else return `$${StringID}_variable_${rndVarBind++}`
}

const rndMap = new Map<string, string>()

export function s(input: string) {
	if (isNotObfuscate) return input
	else {
		if (rndMap.has(input)) return rndMap.get(input) as string
		else {
			const ret = RandomBindingString()
			rndMap.set(input, ret)
			return ret
		}
	}
}

export function bs(input: Binding): Binding {
	if (isNotObfuscate) return input
	else {
		if (rndMap.has(input)) return <Binding>rndMap.get(input)
		else {
			const ret = RandomBindingString()
			rndMap.set(input, ret)
			return ret
		}
	}
}

export function vs(input: Variable): Variable {
	let [name, mode]: [Variable, string] = input.split("|") as [Variable, string]
	input = name
	if (mode) mode = "|" + mode
	else mode = ""

	if (isNotObfuscate) return <Variable>`${name}${mode}`
	else {
		if (rndMap.has(input)) return <Variable>`${rndMap.get(input)}${mode}`
		else {
			const ret = RandomVariableString()
			rndMap.set(input, ret)
			return <Variable>`${ret}${mode}`
		}
	}
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
	const getPath = paths[namespace] || paths[namespace][name]

	// @ts-ignore
	const memoryUI = MemoryModify[getPath]?.[name]
	// @ts-ignore
	if (memoryUI) return memoryUI as ModifyUI<VanillaType<T, K>, VanillaElementChilds<T, K>>
	const path = paths[namespace]

	if (!path) {
		throw new Error(`Namespace '${namespace}' does not exist`)
		// @ts-ignore
	} else if (typeof path !== "string" && !getPath) {
		throw new Error(`Element '${name}' does not exist in namespace '${namespace}'`)
	}
	// @ts-ignore
	const modifyUI = new ModifyUI<VanillaType<T, K>, VanillaElementChilds<T, K>>(
		namespace,
		name,
		// @ts-ignore
		typeof path === "string" ? path : getPath,
	)
	// @ts-ignore
	;(MemoryModify[getPath] ||= {})[name] = modifyUI

	return modifyUI
}

export function Panel(properties?: Panel, namespace?: string, name?: string, allowObfuscate?: boolean) {
	return new UI(Type.PANEL, name, namespace, undefined, allowObfuscate).setProperties(properties || {})
}

export function CollectionPanel(
	properties?: CollectionPanel,
	namespace?: string,
	name?: string,
	allowObfuscate?: boolean,
) {
	return new UI(Type.COLLECTION_PANEL, name, namespace, undefined, allowObfuscate).setProperties(properties || {})
}

export function StackPanel(properties?: StackPanel, namespace?: string, name?: string, allowObfuscate?: boolean) {
	return new UI(Type.STACK_PANEL, name, namespace, undefined, allowObfuscate).setProperties(properties || {})
}

export function InputPanel(properties?: InputPanel, namespace?: string, name?: string, allowObfuscate?: boolean) {
	return new UI(Type.INPUT_PANEL, name, namespace, undefined, allowObfuscate).setProperties(properties || {})
}

export function Grid(properties?: Grid, namespace?: string, name?: string, allowObfuscate?: boolean) {
	return new UI(Type.GRID, name, namespace, undefined, allowObfuscate).setProperties(properties || {})
}

export function Screen(properties?: Screen, namespace?: string, name?: string, allowObfuscate?: boolean) {
	return new UI(Type.SCREEN, name, namespace, undefined, allowObfuscate).setProperties(properties || {})
}

export function Image(properties?: Image, namespace?: string, name?: string, allowObfuscate?: boolean) {
	return new UI(Type.IMAGE, name, namespace, undefined, allowObfuscate).setProperties(properties || {})
}

export function Label(properties?: Label, namespace?: string, name?: string, allowObfuscate?: boolean) {
	return new UI(Type.LABEL, name, namespace, undefined, allowObfuscate).setProperties(properties || {})
}

export function Custom<R extends Renderer>(
	renderer: R,
	properties?: Properties<Type.CUSTOM, R>,
	namespace?: string,
	name?: string,
	allowObfuscate?: boolean,
) {
	const custom = new UI<Type.CUSTOM, R>(Type.CUSTOM, name, namespace, undefined, allowObfuscate)
	if (properties) custom.setProperties({ renderer, ...properties })
	return custom
}

export function TooltipTrigger(
	properties?: TooltipTrigger,
	namespace?: string,
	name?: string,
	allowObfuscate?: boolean,
) {
	return new UI(Type.TOOLTIP_TRIGGER, name, namespace, undefined, allowObfuscate).setProperties(properties || {})
}

export function Button(properties?: Button, namespace?: string, name?: string, allowObfuscate?: boolean) {
	return new UI(Type.BUTTON, name, namespace, undefined, allowObfuscate).setProperties(properties || {})
}

export function Toggle(properties?: Toggle, namespace?: string, name?: string, allowObfuscate?: boolean) {
	return new UI(Type.TOGGLE, name, namespace, undefined, allowObfuscate).setProperties(properties || {})
}

export function Dropdown(properties?: Dropdown, namespace?: string, name?: string, allowObfuscate?: boolean) {
	return new UI(Type.DROPDOWN, name, namespace, undefined, allowObfuscate).setProperties(properties || {})
}

export function SelectionWheel(
	properties?: SelectionWheel,
	namespace?: string,
	name?: string,
	allowObfuscate?: boolean,
) {
	return new UI(Type.SELECTION_WHEEL, name, namespace, undefined, allowObfuscate).setProperties(properties || {})
}

export function EditBox(properties?: EditBox, namespace?: string, name?: string, allowObfuscate?: boolean) {
	return new UI(Type.EDIT_BOX, name, namespace, undefined, allowObfuscate).setProperties(properties || {})
}

export function ScrollbarBox(properties?: ScrollbarBox, namespace?: string, name?: string, allowObfuscate?: boolean) {
	return new UI(Type.SCROLLBAR_BOX, name, namespace, undefined, allowObfuscate).setProperties(properties || {})
}

export function ScrollbarTrack(
	properties?: ScrollbarTrack,
	namespace?: string,
	name?: string,
	allowObfuscate?: boolean,
) {
	return new UI(Type.SCROLL_TRACK, name, namespace, undefined, allowObfuscate).setProperties(properties || {})
}

export function ScrollView(properties?: ScrollView, namespace?: string, name?: string, allowObfuscate?: boolean) {
	return new UI(Type.SCROLL_VIEW, name, namespace, undefined, allowObfuscate).setProperties(properties || {})
}

export function Slider(properties?: Slider, namespace?: string, name?: string, allowObfuscate?: boolean) {
	return new UI(Type.SLIDER, name, namespace, undefined, allowObfuscate).setProperties(properties || {})
}

export function SliderBox(properties?: SliderBox, namespace?: string, name?: string, allowObfuscate?: boolean) {
	return new UI(Type.SLIDER_BOX, name, namespace, undefined, allowObfuscate).setProperties(properties || {})
}

export function ExtendsOf<T extends Type, K extends Renderer | null>(
	element: UI<T, K>,
	properties?: Properties<T, K>,
	namespace?: string,
	name?: string,
	allowObfuscate?: boolean,
) {
	if (!element.extendable) throw new Error("Cannot extend a UI that cannot be extended")
	const ui = new UI<T, K>(undefined, name, namespace, undefined, allowObfuscate)
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
