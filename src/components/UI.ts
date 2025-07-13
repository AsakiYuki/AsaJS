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
import { Modify } from "./Modify";
import { Random } from "./Random";

type ExtractUIType<T, K extends Types = Types.Any>
    = T extends UI<infer U>
    ? U
    : T extends Modify<infer U>
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

export class UI<T extends Types = Types.Any> {
    name?: string;
    namespace?: string;
    extends?: string;
    sourceBindings: Record<string, string> = {};
    private type?: Types;
    private controls?: Array<ChildElement>;
    private bindings?: Array<BindingInterface>;
    private button_mappings?: Array<ButtonMapping>;
    private variables?: VariablesInterface;
    private anims?: Array<string>;
    private properties?: PropertiesType[T];
    constructor(identifier: UIInterface | UI | Modify) {
        const config = Configs.getConfig();

        if (identifier instanceof UI || identifier instanceof Modify) {
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
                else if (identifier.extends instanceof Modify) this.extends = identifier.extends.getPath();
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

    static panel(properties?: Panel, identifier?: StaticUIInterface) {
        return new UI<Types.Panel>(<UIInterface>{
            ...identifier,
            type: Types.Panel,
            properties,
        });
    }

    static stackPanel(properties?: StackPanel, identifier?: StaticUIInterface) {
        return new UI<Types.StackPanel>(<UIInterface>{
            ...identifier,
            type: Types.StackPanel,
            properties,
        });
    }

    static collectionPanel(properties?: CollectionPanel, identifier?: StaticUIInterface) {
        return new UI<Types.CollectionPanel>(<UIInterface>{
            ...identifier,
            type: Types.CollectionPanel,
            properties,
        });
    }

    static inputPanel(properties?: InputPanel, identifier?: StaticUIInterface) {
        return new UI<Types.InputPanel>(<UIInterface>{
            ...identifier,
            type: Types.InputPanel,
            properties,
        });
    }

    static grid(properties?: Grid, identifier?: StaticUIInterface) {
        return new UI<Types.Grid>(<UIInterface>{
            ...identifier,
            type: Types.Grid,
            properties,
        });
    }

    static button(properties?: Button, identifier?: StaticUIInterface) {
        return new UI<Types.Button>(<UIInterface>{
            ...identifier,
            type: Types.Button,
            properties,
        });
    }

    static toggle(properties?: Toggle, identifier?: StaticUIInterface) {
        return new UI<Types.Toggle>(<UIInterface>{
            ...identifier,
            type: Types.Toggle,
            properties,
        });
    }

    static label(properties?: Label, identifier?: StaticUIInterface) {
        return new UI<Types.Label>(<UIInterface>{
            ...identifier,
            type: Types.Label,
            properties,
        });
    }

    static image(properties?: Image, identifier?: StaticUIInterface) {
        return new UI<Types.Image>(<UIInterface>{
            ...identifier,
            type: Types.Image,
            properties,
        });
    }

    static dropdown(properties?: Dropdown, identifier?: StaticUIInterface) {
        return new UI<Types.Dropdown>(<UIInterface>{
            ...identifier,
            type: Types.Dropdown,
            properties,
        });
    }

    static slider(properties?: Slider, identifier?: StaticUIInterface) {
        return new UI<Types.Slider>(<UIInterface>{
            ...identifier,
            type: Types.Slider,
            properties,
        });
    }

    static sliderBox(properties?: SliderBox, identifier?: StaticUIInterface) {
        return new UI<Types.SliderBox>(<UIInterface>{
            ...identifier,
            type: Types.SliderBox,
            properties,
        });
    }

    static editBox(properties?: EditBox, identifier?: StaticUIInterface) {
        return new UI<Types.EditBox>(<UIInterface>{
            ...identifier,
            type: Types.EditBox,
            properties,
        });
    }

    static scrollView(properties?: ScrollView, identifier?: StaticUIInterface) {
        return new UI<Types.ScrollView>(<UIInterface>{
            ...identifier,
            type: Types.ScrollView,
            properties,
        });
    }

    static scrollbarTrack(properties?: ScrollbarTrack, identifier?: StaticUIInterface) {
        return new UI<Types.ScrollbarTrack>(<UIInterface>{
            ...identifier,
            type: Types.ScrollbarTrack,
            properties,
        });
    }

    static scrollbarBox(properties?: ScrollbarBox, identifier?: StaticUIInterface) {
        return new UI<Types.ScrollbarBox>(<UIInterface>{
            ...identifier,
            type: Types.ScrollbarBox,
            properties,
        });
    }

    static screen(properties?: Screen, identifier?: StaticUIInterface) {
        return new UI<Types.Screen>(<UIInterface>{
            ...identifier,
            type: Types.Screen,
            properties,
        });
    }

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

    static extend<K extends Types = Types.Any, T extends string | Identifier | UI | Modify = UI>(
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

    addChild<K extends Types = Types.Any, T extends string | Identifier | UI | Modify = any>(
        element?: T,
        properties?: PropertiesType[ExtractUIType<typeof element, K>] | null | 0,
        name?: string | null | 0,
        callback?: UIChildNameCallback
    ) {
        this.controls ||= [];
        if (!element) return this;

        name ||= Random.getName();

        if (this.isDuplicate(name)) {
            Log.warning(`${CurrentLine()} child element should have a unique name!`);
        }

        if (typeof element === "string") {
            this.controls.push({
                [`${name}@${element}`]: properties ? ReadProperties(<Properties>properties) : {},
            });
        } else if (element instanceof UI || element instanceof Modify) {
            {
                if (element?.getPath() === this.getPath()) {
                    Log.warning(`${CurrentLine()} child element should have a unique name!`);
                }

                this.controls.push({
                    [`${name}@${element?.getPath()}`]: properties
                        ? ReadProperties(<Properties>properties)
                        : {},
                });
            }
        }

        callback?.(this, name);

        return this;
    }

    addBindings(bindings?: Array<BindingInterface> | BindingInterface) {
        this.bindings ||= [];
        if (!bindings) return this;
        if (Array.isArray(bindings)) for (const binding of bindings) this.addBindings(binding);
        else this.bindings.push(ReadBinding(<any>bindings, <any>this));
        return this;
    }

    addMapping(mapping?: Array<ButtonMapping> | ButtonMapping) {
        this.button_mappings ||= [];
        if (!mapping) return this;
        if (Array.isArray(mapping)) mapping.forEach(v => this.addMapping(v));
        else {
            mapping.mapping_type ||= MappingType.Global;
            this.button_mappings.push(mapping);
        }

        return this;
    }

    addVariables(variables?: VariablesInterface) {
        this.variables ||= {};

        if (variables)
            Obj.forEach(variables, (key, value) => {
                (<any>this.variables)[key] = {
                    ...Obj.map(value, (k, v) => {
                        return { key: k, value: ReadValue(v) };
                    }),
                };
            });

        return this;
    }

    addAnimation(animation?: Animation, startIndex?: number) {
        this.anims ||= [];
        if (animation) this.anims.push(animation.getKeyIndex(startIndex || 0));
        return this;
    }

    getUI() {
        const code: any = ReadProperties(<any>(this.properties ?? {}));

        for (const key of ["type", "controls", "bindings", "button_mappings", "anims"])
            if ((<any>this)[key]) code[key] = (<any>this)[key];

        for (const bindingKey in this.sourceBindings) {
            const targetBinding = this.sourceBindings[bindingKey];
            const [sourceBinding, sourceControl] = bindingKey.split(":");

            code.bindings.push({
                binding_type: "view",
                source_control_name: sourceControl,
                source_property_name: sourceBinding,
                target_property_name: targetBinding,
            });
        }

        if (this.variables) code.variables ||= [];
        if (this.variables && Object(this.variables).length !== 0)
            Obj.forEach(this.variables, (k, v) => {
                code.variables.push({
                    requires: k,
                    ...v,
                });
            });

        return code;
    }

    getPath() {
        return `${this.namespace}.${this.name}`;
    }

    getElement() {
        return `@${this.getPath()}`;
    }

    getFullPath(): string {
        return `${this.name}${this.extends ? `@${this.extends}` : ""}`;
    }

    extend(identifier?: ExtendInterface, properties?: PropertiesType[T]) {
        return new UI<T>({
            ...identifier,
            extends: this,
            properties: <Properties>properties,
        });
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
