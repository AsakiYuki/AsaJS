import { LocalizeText } from "../../../components/LocalizeText";
import { Anchor } from "../../enums/Anchor";
import { FontSize } from "../../enums/FontSize";
import { FontType } from "../../enums/FontType";
import { Bool } from "../../values/Bool";
import { ColorVector3 } from "../../values/ColorVector";
import { Float } from "../../values/Number";
import { Str } from "../../values/Str";
import { Var } from "../../values/Variable";

/**
 * Represents configuration options for text display controls, allowing customization of text appearance,
 * behaviors, and formatting options in UI components.
 */
export interface Texts {
    /**
     * The text content to be displayed. This can be a string that is shown in a text control.
     */
    text?: Str | LocalizeText;

    /**
     * The color of the text, represented as a color vector (RGB).
     * This defines the color that the text will be displayed in.
     */
    color?: ColorVector3;

    /**
     * The locked color of the text, represented as a color vector (RGB).
     * This is the color of the text that cannot be changed dynamically.
     */
    locked_color?: ColorVector3;

    /**
     * A flag that determines whether the text should have a shadow.
     * When enabled, a shadow effect will be applied to the text.
     */
    shadow?: Bool;

    /**
     * A flag that determines whether hyphens should be hidden in the text.
     * When enabled, hyphens will not be shown in the text.
     */
    hide_hyphen?: Bool;

    /**
     * A notification or event triggered when text is truncated with ellipses ("...").
     * This can be a string or an array of strings that indicate the action when ellipses are shown.
     */
    notify_on_ellipses?: Str | Array<string>;

    /**
     * A flag that enables or disables the profanity filter for the text.
     * When enabled, the text will be filtered for profane language.
     */
    enable_profanity_filter?: Bool;

    /**
     * The locked alpha value of the text, controlling the transparency.
     * This value determines the opacity of the text and cannot be changed dynamically.
     */
    locked_alpha?: Float;

    /**
     * The font scale factor, which allows scaling the font size.
     * This factor is multiplied by the default font size to adjust the size of the text.
     */
    font_scale_factor?: Float;

    /**
     * A flag that enables or disables localization for the text.
     * When enabled, the text will be localized based on the user's language settings.
     */
    localize?: Bool;

    /**
     * The padding between lines of text, which can be used to adjust the spacing between lines.
     */
    line_padding?: Float;

    /**
     * The font size of the text. This can be a variable or a predefined font size value.
     */
    font_size?: Var | FontSize;

    /**
     * The type of font to use for displaying the text.
     * This can be a variable or a specific font type.
     */
    font_type?: Var | FontType;

    /**
     * The backup font type to be used if the primary font is unavailable.
     */
    backup_font_type?: Var | FontType;

    /**
     * The alignment of the text. This can define how the text is aligned within its container (e.g., left, center, right).
     */
    text_alignment?: Var | Anchor;
}
