import { Bool } from "../../values/Bool";
import { Int, RangeFloat } from "../../values/Number";
import { Str } from "../../values/Str";
import { Vector2 } from "../../values/Vector";
import { Factory } from "../Factory";
import { PropertyBag } from "../PropertyBag";

/**
 * Represents the properties of a control in a UI system, allowing customization of its appearance,
 * behavior, and interactions. This interface includes options for visibility, interactivity,
 * clipping, and more.
 */
export interface Controls {
    /**
     * Determines whether the control is visible. If `false`, the control will not be rendered.
     * This property is optional and defaults to `true` if not specified.
     */
    visible?: Bool;

    /**
     * Specifies whether the control is enabled. If `false`, the control cannot be interacted with.
     * This property is optional and defaults to `true` if not specified.
     */
    enabled?: Bool;

    /**
     * Defines the layer index for the control. Controls with higher layer values are rendered on top of those
     * with lower values. This property is optional.
     */
    layer?: Int;

    /**
     * Controls the opacity (alpha) of the control. A value between 0 and 1, where 0 is fully transparent
     * and 1 is fully opaque. This property is optional.
     */
    alpha?: RangeFloat;

    /**
     * Indicates whether the alpha value should be propagated to child controls. This property is optional.
     */
    propagate_alpha?: Bool;

    /**
     * Specifies whether the control clips its children. If `true`, child elements that extend outside
     * the control's boundaries will be clipped. This property is optional.
     */
    clips_children?: Bool;

    /**
     * Determines whether clipping is allowed within the control's boundaries. This property is optional.
     */
    allow_clipping?: Bool;

    /**
     * Defines an offset for clipping. If clipping is enabled, this value determines how the clipped content
     * will be adjusted. This property is optional.
     */
    clip_offset?: Vector2;

    /**
     * Event name that will be triggered when the clip state of the control changes. This property is optional.
     */
    clip_state_change_event?: Str;

    /**
     * Enables scissor testing for the control, which limits the drawing of content to a specific area.
     * This property is optional.
     */
    enable_scissor_test?: Bool;

    /**
     * A property bag for storing additional custom properties related to the control. This property is optional.
     */
    property_bag?: PropertyBag;

    /**
     * Specifies whether the control is selected. This property is optional.
     */
    selected?: Bool;

    /**
     * Specifies whether to use child anchors for positioning the control’s children. This property is optional.
     */
    use_child_anchors?: Bool;

    /**
     * Disables fast forwarding of animations for this control. This property is optional.
     */
    disable_anim_fast_forward?: Bool;

    /**
     * The name of an animation to reset when the control is reset. This property is optional.
     */
    animation_reset_name?: Str;

    /**
     * Specifies whether the control is ignored by the system, preventing it from being rendered or interacted with.
     * This property is optional.
     */
    ignored?: Bool;

    /**
     * Defines the grid position of the control. This property is optional.
     */
    grid_position?: Vector2;

    /**
     * Defines the index of the control within a collection. This property is optional.
     */
    collection_index?: Int;

    /**
     * JsonUI Scripting not supported yet!
     */
    factory: Factory;
}
