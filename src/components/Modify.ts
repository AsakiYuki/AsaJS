import { JsonBuilder } from "../compilers/generator/JsonBuilder";
import { Log } from "../compilers/generator/Log";
import { CurrentLine } from "../compilers/reader/CurrentLine";
import { Obj } from "../compilers/reader/Object";
import { ReadBinding } from "../compilers/reader/ReadBinding";
import { ReadProperties, ReadValue } from "../compilers/reader/ReadProperties";
import { ChildElement } from "../types/components/ChildIdentifier";
import { Identifier } from "../types/components/Identifier";
import { ExtendInterface } from "../types/components/UIInterface";
import { MappingType } from "../types/enums/MappingTypes";
import { Types } from "../types/enums/Types";
import { BindingInterface } from "../types/objects/BindingInterface";
import { ButtonMapping } from "../types/objects/ButtonMapping";
import { PropertiesType } from "../types/objects/elements/PropertiesType";
import {
    ModificationControls,
    OverrideInterface,
    ModificationInterface,
    ExtractUIType,
} from "../types/objects/Modify";
import { Properties } from "../types/objects/properties/Properties";
import { VariablesInterface } from "../types/objects/Variables";
import { Binding } from "../types/values/Binding";
import { Class } from "./Class";
import { Random } from "./Random";
import { UI } from "./UI";

export class Modify<T extends Types = Types.Any, K extends string = string> extends Class {
    private properties: Properties = {};
    private controls?: Array<ChildElement>;
    private bindings?: Array<BindingInterface>;
    private button_mappings?: Array<ButtonMapping>;
    private variables?: VariablesInterface;
    private anims?: Array<string>;

    private isValidPath: boolean;
    name: string = "";
    namespace: string = "";

    private modifyBindings?: Array<BindingInterface>;
    private removeModifyBindings?: Array<BindingInterface>;
    private modifyControls: ModificationControls = {
        remove: [],
        replace: [],
        insertBack: [],
        insertFront: [],
        insertAfter: [],
        insertBefore: [],
        moveAfter: [],
        moveBack: [],
        moveBefore: [],
        moveFront: [],
    };

    override: OverrideInterface = {
        sourceBindings: {},

        setProperties: (properties: PropertiesType[T]) => {
            this.properties = {
                ...this.properties,
                ...properties,
            };
            return this.override;
        },

        addChild: (element, properties, name, callback) => {
            if (!element) {
                this.controls ||= [];
                return this.override;
            }
            if (!this.controls) this.controls = [];
            name ||= Random.getName();

            this.controls.push({
                [`${name}@${
                    typeof element === "string"
                        ? element.startsWith("@")
                            ? element.slice(1)
                            : element
                        : element.getPath()
                }`]: properties ? ReadProperties(properties) : {},
            });

            callback?.(this, name);

            return this.override;
        },

        addBindings: bindings => {
            if (!bindings) {
                this.bindings ||= [];
                return this.override;
            }
            if (Array.isArray(bindings))
                for (const binding of bindings) this.override.addBindings(binding);
            else (this.bindings ||= []).push(ReadBinding(<any>bindings, this.override));
            return this.override;
        },

        addMapping: (mapping) => {
            this.button_mappings ||= [];
            if (!mapping) return this.override;
            if (Array.isArray(mapping)) mapping.forEach(v => this.override.addMapping(v));
            else {
                mapping.mapping_type ||= MappingType.Global;
                this.button_mappings.push(mapping);
            }

            return this.override;
        },

        addVariables: variables => {
            this.variables ||= {};

            if (variables)
                Obj.forEach(variables, (key, value) => {
                    (<any>this.variables)[key] = {
                        ...Obj.map(value, (k, v) => {
                            return { key: k, value: ReadValue(v) };
                        }),
                    };
                });

            return this.override;
        },

        addAnimation: (animation, startIndex) => {
            this.anims ||= [];

            if (animation) this.anims.push(animation.getKeyIndex(startIndex || 0));
            return this.override;
        },
    
        searchBinding: (
            bindingName: Binding,
            controlName?: string,
            targetBindingName?: Binding
        ) => {
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
        },
    };

    modify: ModificationInterface<K> = {
        bindings: {
            remove: bindings => {
                if (Array.isArray(bindings)) {
                    (this.removeModifyBindings ||= [])?.push(...bindings);
                } else (this.removeModifyBindings ||= [])?.push(bindings);
                return this.modify.bindings;
            },

            addBindings: bindings => {
                if (Array.isArray(bindings))
                    bindings.forEach(binding => this.modify.bindings.addBindings(binding));
                else {
                    (this.modifyBindings ||= []).push(
                        ReadBinding(<any>bindings, <any>this.modify.bindings)
                    );
                }
                return this.modify.bindings;
            },
        },
        controls: {
            remove: childName => {
                if (Array.isArray(childName)) this.modifyControls.remove.push(...childName);
                else this.modifyControls.remove.push(childName);
                return this.modify.controls;
            },

            moveAfter: childName => {
                if (Array.isArray(childName)) this.modifyControls.moveAfter.push(...childName);
                else this.modifyControls.moveAfter.push(childName);
                return this.modify.controls;
            },

            moveBack: childName => {
                if (Array.isArray(childName)) this.modifyControls.moveBack.push(...childName);
                else this.modifyControls.moveBack.push(childName);
                return this.modify.controls;
            },
            moveFront: childName => {
                if (Array.isArray(childName)) this.modifyControls.moveFront.push(...childName);
                else this.modifyControls.moveFront.push(childName);
                return this.modify.controls;
            },
            moveBefore: childName => {
                if (Array.isArray(childName)) this.modifyControls.moveBefore.push(...childName);
                else this.modifyControls.moveBefore.push(childName);
                return this.modify.controls;
            },

            replace: (childName, ui, properties, elementName) => {
                this.modifyControls.replace.push([
                    childName,
                    {
                        [`${elementName || Random.getName()}@${
                            typeof ui === "string" ? ui : ui.getPath()
                        }`]: ReadProperties(properties || {}),
                    },
                ]);
                return this.modify.controls;
            },
            insertAfter: (childName, ui, properties, elementName) => {
                this.modifyControls.insertAfter.push([
                    childName,
                    {
                        [`${elementName || Random.getName()}@${
                            typeof ui === "string" ? ui : ui.getPath()
                        }`]: ReadProperties(properties || {}),
                    },
                ]);
                return this.modify.controls;
            },
            insertBefore: (childName, ui, properties, elementName) => {
                this.modifyControls.insertBefore.push([
                    childName,
                    {
                        [`${elementName || Random.getName()}@${
                            typeof ui === "string" ? ui : ui.getPath()
                        }`]: ReadProperties(properties || {}),
                    },
                ]);
                return this.modify.controls;
            },

            insertBack: (ui, properties, elementName) => {
                this.modifyControls.insertBack.push({
                    [`${elementName || Random.getName()}@${
                        typeof ui === "string" ? ui : ui.getPath()
                    }`]: ReadProperties(properties || {}),
                });
                return this.modify.controls;
            },
            insertFront: (ui, properties, elementName) => {
                this.modifyControls.insertFront.push({
                    [`${elementName || Random.getName()}@${
                        typeof ui === "string" ? ui : ui.getPath()
                    }`]: ReadProperties(properties || {}),
                });
                return this.modify.controls;
            },
        },
    };

    private constructor(properties?: Properties, identifier?: Identifier) {
        super();

        if (properties) this.override.setProperties(properties);
        if (identifier && identifier.name?.match(/\w+/g)?.length === 1 && identifier.namespace)
            this.isValidPath = true;
        else this.isValidPath = false;

        this.name = identifier?.name || "";
        this.namespace = identifier?.namespace || "";
    }

    getPath() {
        if (this.isValidPath) return `${this.namespace}.${this.name}`;
        else {
            Log.error(`${CurrentLine()} Cannot use this element for extend or addChild!`);
            return "";
        }
    }

    getElement() {
        return `@${this.getPath()}`;
    }

    extend(identifier?: ExtendInterface, properties?: PropertiesType[ExtractUIType<typeof this>]) {
        return UI.extend(this, properties, identifier);
    }

    getUI() {
        const code: any = ReadProperties(this.properties);
        const modifications: Array<any> = [];
        for (const key of ["type", "controls", "bindings", "button_mappings", "anims"])
            if ((<any>this)[key]) code[key] = (<any>this)[key];

        if (this.variables) code.variables;
        if (this.variables && Object(this.variables).length !== 0)
            Obj.forEach(this.variables, (k, v) => {
                code.variables.push({
                    requires: k,
                    ...v,
                });
            });

        {
            if (this.modifyBindings) {
                modifications.push({
                    array_name: "bindings",
                    operation: "insert_front",
                    value: this.modifyBindings,
                });
            }
            if (this.removeModifyBindings) {
                modifications.push(
                    ...this.removeModifyBindings.map(v => ({
                        array_name: "bindings",
                        operation: "remove",
                        where: v,
                    }))
                );
            }
        }
        {
            modifications.push(
                ...this.modifyControls.remove.map(controlName => ({
                    array_name: "controls",
                    operation: "remove",
                    control_name: controlName,
                }))
            );
            modifications.push(
                ...this.modifyControls.moveAfter.map(controlName => ({
                    array_name: "controls",
                    operation: "move_after",
                    control_name: controlName,
                }))
            );
            modifications.push(
                ...this.modifyControls.moveBack.map(controlName => ({
                    array_name: "controls",
                    operation: "move_back",
                    control_name: controlName,
                }))
            );
            modifications.push(
                ...this.modifyControls.moveBefore.map(controlName => ({
                    array_name: "controls",
                    operation: "move_before",
                    control_name: controlName,
                }))
            );
            modifications.push(
                ...this.modifyControls.moveFront.map(controlName => ({
                    array_name: "controls",
                    operation: "move_front",
                    control_name: controlName,
                }))
            );
            modifications.push(
                ...this.modifyControls.replace.map(([childName, element]) => ({
                    array_name: "controls",
                    operation: "replace",
                    control_name: childName,
                    value: element,
                }))
            );
            modifications.push(
                ...this.modifyControls.insertAfter.map(([childName, element]) => ({
                    array_name: "controls",
                    operation: "insert_after",
                    control_name: childName,
                    value: [element],
                }))
            );
            modifications.push(
                ...this.modifyControls.insertBefore.map(([childName, element]) => ({
                    array_name: "controls",
                    operation: "insert_before",
                    control_name: childName,
                    value: [element],
                }))
            );
            if (this.modifyControls.insertBack.length)
                modifications.push({
                    array_name: "controls",
                    operation: "insert_back",
                    value: this.modifyControls.insertBack,
                });
            if (this.modifyControls.insertFront.length)
                modifications.push({
                    array_name: "controls",
                    operation: "insert_front",
                    value: this.modifyControls.insertFront,
                });
        }

        if (modifications.length > 0) code["modifications"] = modifications;

        for (const bindingKey in this.override.sourceBindings) {
            const targetBinding = this.override.sourceBindings[bindingKey];
            const [sourceBinding, sourceControl] = bindingKey.split(":");

            code.bindings.push({
                binding_type: "view",
                source_control_name: sourceControl,
                source_property_name: sourceBinding,
                target_property_name: targetBinding,
            });
        }

        return Object.keys(code).length > 0 ? code : undefined;
    }

    addChild<T extends string | UI<any> | Modify<any, any>>(
        element: T,
        properties?: PropertiesType[ExtractUIType<typeof element>],
        elementName?: string
    ) {
        this.modify.controls.insertFront(element, properties, elementName);
        return this;
    }

    static register<T extends Types = Types.Any, K extends string = string>(
        filePath: string,
        elementPath: string,
        properties?: Properties
    ) {
        return this.registerWithNamespace<T, K>(filePath, elementPath, "", properties);
    }

    static registerWithNamespace<T extends Types = Types.Any, K extends string = string>(
        filePath: string,
        elementPath: string,
        namespace: string,
        properties?: Properties
    ) {
        const modify = JsonBuilder.getModify(filePath, elementPath);
        modify?.override?.setProperties(properties || {});
        return <Modify<T, K>>(modify ||
            JsonBuilder.registerModify(
                filePath,
                elementPath,
                new Modify<T, K>(properties, {
                    name: elementPath,
                    namespace,
                })
            ));
    }
}
