import { Configs } from "../compilers/Config";
import { JsonBuilder } from "../compilers/generator/JsonBuilder";
import { Log } from "../compilers/generator/Log";
import { CurrentLine } from "../compilers/reader/CurrentLine";
import { Obj } from "../compilers/reader/Object";
import { ReadBinding } from "../compilers/reader/ReadBinding";
import { ReadProperties, ReadValue } from "../compilers/reader/ReadProperties";
import { ChildElement } from "../types/components/ChildIdentifier";
import { Identifier } from "../types/components/Identifier";
import { UIChildNameCallback } from "../types/components/NameCallback";
import { ExtendInterface, StaticUIInterface, UIInterface } from "../types/components/UIInterface";
import { MappingType } from "../types/enums/MappingTypes";
import { Renderer } from "../types/enums/Renderer";
import { Types } from "../types/enums/Types";
import { BindingInterface } from "../types/objects/BindingInterface";
import { ButtonMapping } from "../types/objects/ButtonMapping";
import { Button } from "../types/objects/elements/Button";
import { CollectionPanel } from "../types/objects/elements/CollectionPanel";
import { Dropdown } from "../types/objects/elements/Dropdown";
import { EditBox } from "../types/objects/elements/EditBox";
import { Grid } from "../types/objects/elements/Grid";
import { Image } from "../types/objects/elements/Image";
import { InputPanel } from "../types/objects/elements/InputPanel";
import { Label } from "../types/objects/elements/Label";
import { Panel } from "../types/objects/elements/panel";
import { PropertiesType } from "../types/objects/elements/PropertiesType";
import { Screen } from "../types/objects/elements/Screen";
import { ScrollbarBox } from "../types/objects/elements/ScrollbarBox";
import { ScrollbarTrack } from "../types/objects/elements/ScrollbarTrack";
import { ScrollView } from "../types/objects/elements/ScrollView";
import { Slider } from "../types/objects/elements/Slider";
import { SliderBox } from "../types/objects/elements/SliderBox";
import { StackPanel } from "../types/objects/elements/StackPanel";
import { Toggle } from "../types/objects/elements/Toggle";
import { TooltipTrigger } from "../types/objects/elements/TooltipTrigger";
import { Properties } from "../types/objects/properties/Properties";
import { Specials } from "../types/objects/properties/Specials";
import { VariablesInterface } from "../types/objects/Variables";
import { Binding } from "../types/values/Binding";
import { Animation } from "./Animation";
import { Random } from "./Random";

type ExtractUIType<T, K extends Types = Types.Any> = T extends UI<infer U>
    ? U
    : T extends string
    ? K
    : T extends Identifier
    ? K
    : never;

interface TypeExtend {
    [key: string]: string;
}
const typeExtend: TypeExtend = {};

/**
 * A class representing a UI element that can be used to create and manage various UI components.
 * It includes properties, bindings, children, animations, and extends other UI components.
 */
export class UI<T extends Types = Types.Any> {
    /**
     * The name of the UI element.
     * This can be automatically generated or specified in the constructor.
     */
    name?: string;

    /**
     * The namespace of the UI element, used for unique identification.
     * This can be automatically generated or specified in the constructor.
     */
    namespace?: string;

    /**
     * The type of the UI element, which could extend from another element.
     */
    extends?: string;

    /**
     * The type of the UI element (e.g., Panel, Button, etc.).
     * @private
     */
    private type?: Types;

    /**
     * The child elements contained within the UI element.
     * @private
     */
    private controls?: Array<ChildElement>;

    /**
     * The bindings of the UI element, linking properties to other elements.
     * @private
     */
    private bindings?: Array<BindingInterface>;

    /**
     * @private
     */
    private button_mappings?: Array<ButtonMapping>;

    /**
     * The variables associated with the UI element.
     * @private
     */
    private variables?: VariablesInterface;

    /**
     * The list of animations associated with the UI element.
     * @private
     */
    private anims?: Array<string>;

    /**
     * The properties of the UI element.
     * @private
     */
    private properties?: PropertiesType[T];

    /**
     * Constructs a new UI element, either by creating a new one or extending an existing one.
     * @param identifier A UI element or UI interface used to initialize this element.
     */
    constructor(identifier: UIInterface | UI) {
        const config = Configs.getConfig();

        if (identifier instanceof UI) {
            this.name = Random.getName();
            this.namespace = Random.getNamespace();
            this.extends = identifier.getPath();
        } else {
            this.name = (!config.compiler.UI.obfuscateName && identifier?.name) || Random.getName();
            this.namespace =
                (!config.compiler.UI.obfuscateName && identifier?.namespace) ||
                Random.getNamespace();

            if (identifier?.extends) {
                if (identifier.type) {
                    this.type = identifier.type;
                }

                if (identifier.extends instanceof UI)
                    this.extends = `${identifier.extends.getPath()}`;
                else if (typeof identifier.extends === "string") this.extends = identifier.extends;
                else this.extends = `${identifier.extends.namespace}.${identifier.extends.name}`;
            } else {
                if (config.compiler.UI.obfuscateType && identifier.namespace !== "_type_c") {
                    const type = identifier?.type || Types.Panel;
                    this.extends = typeExtend[type] ||= new UI({
                        name: type,
                        namespace: "_type_c",
                        type,
                    }).getPath();
                } else this.type = identifier?.type || Types.Panel;
            }

            if (identifier?.properties) this.setProperties(<any>identifier.properties);
        }

        JsonBuilder.registerElement(this.namespace, <any>this);
    }

    /**
     * Creates a Panel UI element with specified properties and identifier.
     * @param properties Properties to apply to the Panel.
     * @param identifier An optional identifier for the UI element.
     * @returns A new UI instance representing a Panel.
     */
    static panel(properties?: Panel, identifier?: StaticUIInterface) {
        return new UI<Types.Panel>(<UIInterface>{
            ...identifier,
            type: Types.Panel,
            properties,
        });
    }

    /**
     * Creates a StackPanel UI element with specified properties and identifier.
     * @param properties Properties to apply to the StackPanel.
     * @param identifier An optional identifier for the UI element.
     * @returns A new UI instance representing a StackPanel.
     */
    static stackPanel(properties?: StackPanel, identifier?: StaticUIInterface) {
        return new UI<Types.StackPanel>(<UIInterface>{
            ...identifier,
            type: Types.StackPanel,
            properties,
        });
    }

    /**
     * Creates a CollectionPanel UI element with specified properties and identifier.
     * @param properties Properties to apply to the CollectionPanel.
     * @param identifier An optional identifier for the UI element.
     * @returns A new UI instance representing a CollectionPanel.
     */
    static collectionPanel(properties?: CollectionPanel, identifier?: StaticUIInterface) {
        return new UI<Types.CollectionPanel>(<UIInterface>{
            ...identifier,
            type: Types.CollectionPanel,
            properties,
        });
    }

    /**
     * Creates an InputPanel UI element with specified properties and identifier.
     * @param properties Properties to apply to the InputPanel.
     * @param identifier An optional identifier for the UI element.
     * @returns A new UI instance representing an InputPanel.
     */
    static inputPanel(properties?: InputPanel, identifier?: StaticUIInterface) {
        return new UI<Types.InputPanel>(<UIInterface>{
            ...identifier,
            type: Types.InputPanel,
            properties,
        });
    }

    /**
     * Creates a Grid UI element with specified properties and identifier.
     * @param properties Properties to apply to the Grid.
     * @param identifier An optional identifier for the UI element.
     * @returns A new UI instance representing a Grid.
     */
    static grid(properties?: Grid, identifier?: StaticUIInterface) {
        return new UI<Types.Grid>(<UIInterface>{
            ...identifier,
            type: Types.Grid,
            properties,
        });
    }

    /**
     * Creates a Button UI element with specified properties and identifier.
     * @param properties Properties to apply to the Button.
     * @param identifier An optional identifier for the UI element.
     * @returns A new UI instance representing a Button.
     */
    static button(properties?: Button, identifier?: StaticUIInterface) {
        return new UI<Types.Button>(<UIInterface>{
            ...identifier,
            type: Types.Button,
            properties,
        });
    }

    /**
     * Creates a Toggle UI element with specified properties and identifier.
     * @param properties Properties to apply to the Toggle.
     * @param identifier An optional identifier for the UI element.
     * @returns A new UI instance representing a Toggle.
     */
    static toggle(properties?: Toggle, identifier?: StaticUIInterface) {
        return new UI<Types.Toggle>(<UIInterface>{
            ...identifier,
            type: Types.Toggle,
            properties,
        });
    }

    /**
     * Creates a Label UI element with specified properties and identifier.
     * @param properties Properties to apply to the Label.
     * @param identifier An optional identifier for the UI element.
     * @returns A new UI instance representing a Label.
     */
    static label(properties?: Label, identifier?: StaticUIInterface) {
        return new UI<Types.Label>(<UIInterface>{
            ...identifier,
            type: Types.Label,
            properties,
        });
    }

    /**
     * Creates an Image UI element with specified properties and identifier.
     * @param properties Properties to apply to the Image.
     * @param identifier An optional identifier for the UI element.
     * @returns A new UI instance representing an Image.
     */
    static image(properties?: Image, identifier?: StaticUIInterface) {
        return new UI<Types.Image>(<UIInterface>{
            ...identifier,
            type: Types.Image,
            properties,
        });
    }

    /**
     * Creates a Dropdown UI element with specified properties and identifier.
     * @param properties Properties to apply to the Dropdown.
     * @param identifier An optional identifier for the UI element.
     * @returns A new UI instance representing a Dropdown.
     */
    static dropdown(properties?: Dropdown, identifier?: StaticUIInterface) {
        return new UI<Types.Dropdown>(<UIInterface>{
            ...identifier,
            type: Types.Dropdown,
            properties,
        });
    }

    /**
     * Creates a Slider UI element with specified properties and identifier.
     * @param properties Properties to apply to the Slider.
     * @param identifier An optional identifier for the UI element.
     * @returns A new UI instance representing a Slider.
     */
    static slider(properties?: Slider, identifier?: StaticUIInterface) {
        return new UI<Types.Slider>(<UIInterface>{
            ...identifier,
            type: Types.Slider,
            properties,
        });
    }

    /**
     * Creates a SliderBox UI element with specified properties and identifier.
     * @param properties Properties to apply to the SliderBox.
     * @param identifier An optional identifier for the UI element.
     * @returns A new UI instance representing a SliderBox.
     */
    static sliderBox(properties?: SliderBox, identifier?: StaticUIInterface) {
        return new UI<Types.SliderBox>(<UIInterface>{
            ...identifier,
            type: Types.SliderBox,
            properties,
        });
    }

    /**
     * Creates an EditBox UI element with specified properties and identifier.
     * @param properties Properties to apply to the EditBox.
     * @param identifier An optional identifier for the UI element.
     * @returns A new UI instance representing an EditBox.
     */
    static editBox(properties?: EditBox, identifier?: StaticUIInterface) {
        return new UI<Types.EditBox>(<UIInterface>{
            ...identifier,
            type: Types.EditBox,
            properties,
        });
    }

    /**
     * Creates a ScrollView UI element with specified properties and identifier.
     * @param properties Properties to apply to the ScrollView.
     * @param identifier An optional identifier for the UI element.
     * @returns A new UI instance representing a ScrollView.
     */
    static scrollView(properties?: ScrollView, identifier?: StaticUIInterface) {
        return new UI<Types.ScrollView>(<UIInterface>{
            ...identifier,
            type: Types.ScrollView,
            properties,
        });
    }

    /**
     * Creates a ScrollbarTrack UI element with specified properties and identifier.
     * @param properties Properties to apply to the ScrollbarTrack.
     * @param identifier An optional identifier for the UI element.
     * @returns A new UI instance representing a ScrollbarTrack.
     */
    static scrollbarTrack(properties?: ScrollbarTrack, identifier?: StaticUIInterface) {
        return new UI<Types.ScrollbarTrack>(<UIInterface>{
            ...identifier,
            type: Types.ScrollbarTrack,
            properties,
        });
    }

    /**
     * Creates a ScrollbarBox UI element with specified properties and identifier.
     * @param properties Properties to apply to the ScrollbarBox.
     * @param identifier An optional identifier for the UI element.
     * @returns A new UI instance representing a ScrollbarBox.
     */
    static scrollbarBox(properties?: ScrollbarBox, identifier?: StaticUIInterface) {
        return new UI<Types.ScrollbarBox>(<UIInterface>{
            ...identifier,
            type: Types.ScrollbarBox,
            properties,
        });
    }

    /**
     * Creates a Screen UI element with specified properties and identifier.
     * @param properties Properties to apply to the Screen.
     * @param identifier An optional identifier for the UI element.
     * @returns A new UI instance representing a Screen.
     */
    static screen(properties?: Screen, identifier?: StaticUIInterface) {
        return new UI<Types.Screen>(<UIInterface>{
            ...identifier,
            type: Types.Screen,
            properties,
        });
    }

    /**
     * Creates a custom UI element with specified properties and renderer.
     * @param renderer The renderer to use for the custom element.
     * @param properties The properties for the custom element.
     * @param propertyBag Additional properties for the custom element.
     * @param identifier An optional identifier for the UI element.
     * @returns A new UI instance representing a custom element.
     */
    static custom<T extends Renderer>(
        renderer: T,
        properties?: Panel | Specials[T],
        identifier?: StaticUIInterface
    ) {
        return new UI<Types.Custom>(<UIInterface>{
            ...identifier,
            type: Types.Custom,
            properties: {
                ...properties,
                renderer,
            },
        });
    }

    static tooltipTrigger(properties?: TooltipTrigger, identifier?: StaticUIInterface) {
        return new UI<Types.TooltipTrigger>(<UIInterface>{
            ...identifier,
            type: Types.TooltipTrigger,
            properties,
        });
    }

    /**
     * Extends an existing UI element with specified properties.
     * @param extendElement The UI element or identifier to extend.
     * @param properties Additional properties for the extended element.
     * @returns A new UI instance representing the extended element.
     */
    static extend<K extends Types = Types.Any, T extends string | Identifier | UI = UI>(
        extendElement?: T,
        properties?: PropertiesType[ExtractUIType<typeof extendElement, K>],
        identifier?: StaticUIInterface
    ) {
        if (identifier)
            return new UI<ExtractUIType<typeof extendElement, K>>({
                extends: extendElement,
                ...identifier,
            });
        else
            return new UI<ExtractUIType<typeof extendElement, K>>({
                extends: extendElement,
                properties: <Properties>properties,
            });
    }

    /**
     * Searches for a binding in the UI element based on the given parameters.
     * @param bindingName The binding name to search for.
     * @param controlName Optional control name to filter bindings.
     * @param targetBindingName Optional target binding name to filter further.
     * @returns The target binding name or undefined if not found.
     */
    searchBinding(bindingName: Binding, controlName?: string, targetBindingName?: Binding) {
        for (let index = 0; index < (this.bindings?.length || 0); index++) {
            const binding = this.bindings?.[index];
            if (controlName) {
                if (
                    binding?.source_control_name === controlName &&
                    binding.source_property_name === bindingName
                ) {
                    if (targetBindingName) {
                        if (binding.target_property_name === targetBindingName) {
                            return targetBindingName;
                        } else return undefined;
                    } else return binding.target_property_name;
                }
            } else {
                if (binding?.source_property_name === bindingName) {
                    if (targetBindingName) {
                        if (binding.target_property_name === targetBindingName) {
                            return targetBindingName;
                        } else return undefined;
                    } else return binding.target_property_name;
                }
            }
        }
        return undefined;
    }

    /**
     * Sets the properties of the UI element.
     * @param properties The properties to apply to the UI element.
     * @returns The updated UI instance.
     */
    setProperties(properties: PropertiesType[T]) {
        if ((<any>properties).property_bag) {
            (<any>properties).property_bag = {
                ...(<any>this).properties?.property_bag,
                ...(<any>properties).property_bag,
            };
        }
        (<any>this).properties = {
            ...(this.properties || {}),
            ...properties,
        };
        return this;
    }

    private isDuplicate(name: string) {
        for (const childElement of this.controls || []) {
            const childKey = Object.keys(childElement)[0];
            const childName = childKey.split("@")[0];

            if (childName === name) return true;
        }
        return false;
    }

    private isRecusive(name: string) {
        return name === this.name;
    }

    addChild<K extends Types = Types.Any, T extends string | Identifier | UI = UI>(
        element: T,
        properties?: PropertiesType[ExtractUIType<typeof element, K>] | null | 0,
        name?: string | null | 0,
        callback?: UIChildNameCallback
    ) {
        if (!this.controls) this.controls = [];
        name ||= Random.getName();

        if (this.isDuplicate(name)) {
            Log.warning(`${CurrentLine()} child element should have a unique name!`);
        }

        if (typeof element === "string") {
            this.controls.push({ [`${name}@${element}`]: properties ? ReadProperties(<Properties>properties) : {} });
        } else if (element instanceof UI) {
            {
                if (element?.getPath() === this.getPath()) {
                    Log.warning(`${CurrentLine()} child element should have a unique name!`);
                }

                this.controls.push({
                    [`${name}@${element?.getPath()}`]: properties ? ReadProperties(<Properties>properties) : {},
                });
            }
        }

        callback?.(this, name);

        return this;
    }

    /**
     * Adds bindings to the UI element.
     * @param bindings The bindings to add (single or multiple).
     * @returns The updated UI instance.
     */
    addBindings(bindings: Array<BindingInterface> | BindingInterface) {
        if (Array.isArray(bindings)) for (const binding of bindings) this.addBindings(binding);
        else (this.bindings ||= []).push(ReadBinding(<any>bindings, <any>this));
        return this;
    }

    /**
     * Adds variables to the UI element.
     * @param variables The variables to add.
     * @returns The updated UI instance.
     */
    addVariables(variables: VariablesInterface) {
        this.variables ||= {};

        Obj.forEach(variables, (key, value) => {
            (<any>this.variables)[key] = {
                ...Obj.map(value, (k, v) => {
                    return { key: k, value: ReadValue(v) };
                }),
            };
        });

        return this;
    }

    /**
     * Retrieves the UI properties and their associated values.
     * @returns The UI properties in a structured format.
     */
    getUI() {
        const code: any = ReadProperties(<any>(this.properties ?? {}));

        for (const key of ["type", "controls", "bindings", "button_mappings", "anims"])
            if ((<any>this)[key]) code[key] = (<any>this)[key];

        if (this.variables)
            Obj.forEach(this.variables, (k, v) => {
                (code.variables ||= []).push({
                    requires: k,
                    ...v,
                });
            });

        return code;
    }

    /**
     * Retrieves the path of the UI element.
     * @returns The path in the format 'namespace.name'.
     */
    getPath() {
        return `${this.namespace}.${this.name}`;
    }

    /**
     * Retrieves the element identifier for the UI element.
     * @returns The element identifier in the format '@namespace.name'.
     */
    getElement() {
        return `@${this.getPath()}`;
    }

    /**
     * Retrieves the full path of the UI element, including extensions.
     * @returns The full path with extensions if available.
     */
    getFullPath(): string {
        return `${this.name}${this.extends ? `@${this.extends}` : ""}`;
    }

    /**
     * Extends the current UI element with additional properties or an identifier.
     * @param identifier An optional identifier to extend the element.
     * @param properties Additional properties for the extended element.
     * @returns A new UI instance representing the extended element.
     */
    extend(identifier?: ExtendInterface, properties?: PropertiesType[T]) {
        return new UI<T>({
            ...identifier,
            extends: this,
            properties: <Properties>properties,
        });
    }

    /**
     * Adds an animation to the UI element.
     * @param animation The animation to add.
     * @param startIndex The starting index for the animation (optional).
     * @returns The updated UI instance.
     */
    addAnimation(animation: Animation, startIndex?: number) {
        (this.anims ||= []).push(animation.getKeyIndex(startIndex || 0));
        return this;
    }

    /**
     * Adds mappings to UI element.
     */
    addMapping(mapping: Array<ButtonMapping> | ButtonMapping) {
        if (Array.isArray(mapping)) mapping.forEach(v => this.addMapping(v));
        else {
            mapping.mapping_type ||= MappingType.Global;
            (this.button_mappings ||= []).push(mapping);
        }

        return this;
    }

    private static apply() { }
    private static arguments = "";
    private static bind() { }
    private static call() { }
    private static caller = "";
    private static length = "";
    private static name = "";
    private static toString() { }
}
