import { JsonBuilder } from "../compilers/generator/JsonBuilder";
import { Log } from "../compilers/generator/Log";
import { CurrentLine } from "../compilers/reader/CurrentLine";
import { Obj } from "../compilers/reader/Object";
import { ReadBinding } from "../compilers/reader/ReadBinding";
import { ReadProperties, ReadValue } from "../compilers/reader/ReadProperties";
import { ChildElement } from "../types/components/ChildIdentifier";
import { Identifier } from "../types/components/Identifier";
import { UIChildNameCallback } from "../types/components/NameCallback";
import { ExtendInterface } from "../types/components/UIInterface";
import { BindingName } from "../types/enums/BindingName";
import { Types } from "../types/enums/Types";
import { BindingInterface } from "../types/objects/BindingInterface";
import { PropertiesType } from "../types/objects/elements/PropertiesType";
import { Properties } from "../types/objects/properties/Properties";
import { VariablesInterface } from "../types/objects/Variables";
import { Binding } from "../types/values/Binding";
import { Var } from "../types/values/Variable";
import { Random } from "./Random";
import { UI } from "./UI";

type ExtractUIType<T> = T extends UI<infer U> ? U : T extends Modify<infer U> ? U : never;

export interface OverrideInterface {
    setProperties(properties: PropertiesType[Types]): OverrideInterface;
    addChild<T extends string | UI<any>>(
        element?: T,
        properties?: PropertiesType[ExtractUIType<typeof element>],
        name?: string | null,
        callback?: UIChildNameCallback
    ): OverrideInterface;
    addBindings(
        binding?: BindingInterface | Binding | Var | Array<BindingInterface | Binding | Var>
    ): OverrideInterface;
    addVariables(variables?: VariablesInterface): OverrideInterface;
    searchBinding(bindingName: BindingName, controlName: string): any;
}

export interface ModificationBindingsInterface {
    remove(binding: BindingInterface | BindingInterface[]): ModificationBindingsInterface;
    addBindings(
        binding: BindingInterface | Binding | Var | Array<BindingInterface | Binding | Var>
    ): ModificationBindingsInterface;
}

export interface ModificationControlsInterface<K extends string = string> {
    remove(childName: K | K[]): ModificationControlsInterface;
    moveBack(childName: K | K[]): ModificationControlsInterface;
    moveFront(childName: K | K[]): ModificationControlsInterface;
    moveAfter(childName: K | K[]): ModificationControlsInterface;
    moveBefore(childName: K | K[]): ModificationControlsInterface;
    replace<T extends string | UI<any> | Modify<any, any>>(
        childName: K,
        element: T,
        properties?: PropertiesType[ExtractUIType<typeof element>],
        elementName?: string
    ): ModificationControlsInterface;
    insertBack<T extends string | UI<any> | Modify<any, any>>(
        element: T,
        properties?: PropertiesType[ExtractUIType<typeof element>],
        elementName?: string
    ): ModificationControlsInterface;
    insertFront<T extends string | UI<any> | Modify<any, any>>(
        element: T,
        properties?: PropertiesType[ExtractUIType<typeof element>],
        elementName?: string
    ): ModificationControlsInterface;
    insertAfter<T extends string | UI<any> | Modify<any, any>>(
        childName: K,
        element: T,
        properties?: PropertiesType[ExtractUIType<typeof element>],
        elementName?: string
    ): ModificationControlsInterface;
    insertBefore<T extends string | UI<any> | Modify<any, any>>(
        childName: K,
        element: T,
        properties?: PropertiesType[ExtractUIType<typeof element>],
        elementName?: string
    ): ModificationControlsInterface;
}

export interface ModificationInterface<T extends string = string> {
    bindings: ModificationBindingsInterface;
    controls: ModificationControlsInterface<T>;
}

export interface ModificationControls {
    remove: Array<string>;
    replace: Array<[string, ChildElement]>;
    insertBack: Array<ChildElement>;
    insertFront: Array<ChildElement>;
    insertAfter: Array<[string, ChildElement]>;
    insertBefore: Array<[string, ChildElement]>;
    moveBack: Array<string>;
    moveFront: Array<string>;
    moveAfter: Array<string>;
    moveBefore: Array<string>;
}

/**
 * Represents a class used to modify the properties, controls, bindings, and variables of a Minecraft UI element.
 * This class provides various methods to manipulate UI elements dynamically and compile them into JSON format.
 *
 * @class Modify
 */
export class Modify<T extends Types = Types.Any, K extends string = string> {
    private properties: Properties = {};
    private controls?: Array<ChildElement>;
    private bindings?: Array<BindingInterface>;
    private variables?: VariablesInterface;

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
                [`${name}${typeof element === "string" ? element : element.getPath()}`]: properties
                    ? ReadProperties(properties)
                    : {},
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
                        [`${elementName || Random.getName()}@${typeof ui === "string" ? ui : ui.getPath()
                            }`]: ReadProperties(properties || {}),
                    },
                ]);
                return this.modify.controls;
            },
            insertAfter: (childName, ui, properties, elementName) => {
                this.modifyControls.insertAfter.push([
                    childName,
                    {
                        [`${elementName || Random.getName()}@${typeof ui === "string" ? ui : ui.getPath()
                            }`]: ReadProperties(properties || {}),
                    },
                ]);
                return this.modify.controls;
            },
            insertBefore: (childName, ui, properties, elementName) => {
                this.modifyControls.insertBefore.push([
                    childName,
                    {
                        [`${elementName || Random.getName()}@${typeof ui === "string" ? ui : ui.getPath()
                            }`]: ReadProperties(properties || {}),
                    },
                ]);
                return this.modify.controls;
            },

            insertBack: (ui, properties, elementName) => {
                this.modifyControls.insertBack.push({
                    [`${elementName || Random.getName()}@${typeof ui === "string" ? ui : ui.getPath()
                        }`]: ReadProperties(properties || {}),
                });
                return this.modify.controls;
            },
            insertFront: (ui, properties, elementName) => {
                this.modifyControls.insertFront.push({
                    [`${elementName || Random.getName()}@${typeof ui === "string" ? ui : ui.getPath()
                        }`]: ReadProperties(properties || {}),
                });
                return this.modify.controls;
            },
        },
    };

    private constructor(properties?: Properties, identifier?: Identifier) {
        if (properties) this.override.setProperties(properties);

        if (identifier && identifier.name?.match(/\w+/g)?.length === 1 && identifier.namespace) this.isValidPath = true;
        else this.isValidPath = false;

        this.name = identifier?.name || "";
        this.namespace = identifier?.namespace || "";
    }

    getPath() {
        if (this.isValidPath) return `${this.namespace}.${this.name}`;
        else {
            Log.error(`${CurrentLine()} Cannot get path for this Modify element`);
            return ""
        };
    }

    getElement() {
        return `@${this.getPath()}`;
    }

    extend(identifier?: ExtendInterface, properties?: PropertiesType[ExtractUIType<typeof this>]) {
        if (this.isValidPath) Log.error(`${CurrentLine()} Cannot extend this Modify element`);
        return UI.extend(this, properties, identifier)
    }

    getUI() {
        const code: any = ReadProperties(this.properties);
        const modifications: Array<any> = [];

        for (const key of ["type", "controls", "bindings", "button_mappings"])
            if ((<any>this)[key]) code[key] = (<any>this)[key];

        if (this.variables)
            Obj.forEach(this.variables, (k, v) => {
                (code.variables ||= []).push({
                    requires: k,
                    ...v,
                });
            });

        if (this.variables && Object.keys(this.variables).length === 0) code.variables ||= [];

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

    private static apply() { }
    private static arguments = "";
    private static bind() { }
    private static call() { }
    private static caller = "";
    private static length = "";
    private static name = "";
    private static toString() { }
}
