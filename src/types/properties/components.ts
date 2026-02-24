import { Renderer } from "../enums/Renderer.js"
import { Type } from "../enums/Type.js"
import * as e from "./element/index.js"

export interface Panel extends e.Control, e.Layout {}
export interface CollectionPanel extends Panel, e.Collection {}
export interface StackPanel extends CollectionPanel, e.StackPanel {}
export interface InputPanel extends Panel, e.Collection, e.Input, e.Sound, e.Focus, e.TTS {}
export interface Grid extends CollectionPanel, e.Grid {}
export interface Screen extends Panel, e.Screen {}

export interface Image extends Panel, e.Image {}
export interface Label extends Panel, e.Text {}
export interface Custom extends Panel, e.CustomRenderer {}
export interface TooltipTrigger extends InputPanel, e.TooltipTrigger {}

export interface Button extends InputPanel, e.Button {}
export interface Toggle extends InputPanel, e.Toggle {}
export interface Dropdown extends Toggle, e.Dropdown {}
export interface SelectionWheel extends InputPanel, e.SelectionWheel {}
export interface EditBox extends Button, e.EditBox {}

export interface ScrollbarBox extends Panel, e.Input {}
export interface ScrollbarTrack extends ScrollbarBox {}
export interface ScrollView extends ScrollbarBox, e.ScrollView {}

export interface Slider extends InputPanel, e.Slider {}
export interface SliderBox extends ScrollbarBox, e.SliderBox {}

export interface ComponenetsProperties {
	[Type.PANEL]: Panel
	[Type.COLLECTION_PANEL]: CollectionPanel
	[Type.STACK_PANEL]: StackPanel
	[Type.INPUT_PANEL]: InputPanel
	[Type.GRID]: Grid
	[Type.SCREEN]: Screen

	[Type.IMAGE]: Image
	[Type.LABEL]: Label
	[Type.CUSTOM]: Custom
	[Type.TOOLTIP_TRIGGER]: TooltipTrigger

	[Type.BUTTON]: Button
	[Type.TOGGLE]: Toggle
	[Type.DROPDOWN]: Dropdown
	[Type.SELECTION_WHEEL]: SelectionWheel
	[Type.EDIT_BOX]: EditBox

	[Type.SCROLLBAR_BOX]: ScrollbarBox
	[Type.SCROLL_TRACK]: ScrollbarTrack
	[Type.SCROLL_VIEW]: ScrollView
	[Type.SLIDER]: Slider
	[Type.SLIDER_BOX]: SliderBox
}

export interface CustomRendererProperties {
	[Renderer.PAPER_DOLL_RENDERER]: e.PaperDollRenderer
	[Renderer.NETEASE_PAPER_DOLL_RENDERER]: e.NeteasePaperDollRenderer
	[Renderer.NETEASE_MINI_MAP_RENDERER]: e.NeteaseMiniMapRenderer
	[Renderer.PROGRESS_BAR_RENDERER]: e.ProgressBarRenderer
	[Renderer.GRADIENT_RENDERER]: e.GradientRenderer
	[Renderer.NAME_TAG_RENDERER]: e.NameTagRenderer
	[Renderer.HOVER_TEXT_RENDERER]: e.HoverTextRenderer
	[Renderer.DEBUG_OVERLAY_RENDERER]: e.Debug
	[Renderer.EQUIPMENT_PREVIEW_RENDERER]: e.EquipmentPreviewRenderer
}

export type Properties<T extends Type, K extends Renderer | null = null> = (T extends keyof ComponenetsProperties
	? Partial<ComponenetsProperties[T]>
	: {}) &
	(K extends keyof CustomRendererProperties ? Partial<CustomRendererProperties[K]> : {})
