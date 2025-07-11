import { Animation } from "../../components/Animation";
import { Modify } from "../../components/Modify";
import { UI } from "../../components/UI";
import { ChildElement } from "../components/ChildIdentifier";
import { UIChildNameCallback } from "../components/NameCallback";
import { BindingName } from "../enums/BindingName";
import { Types } from "../enums/Types";
import { Binding } from "../values/Binding";
import { Var } from "../values/Variable";
import { BindingInterface } from "./BindingInterface";
import { ButtonMapping } from "./ButtonMapping";
import { PropertiesType } from "./elements/PropertiesType";
import { VariablesInterface } from "./Variables";

export type ExtractUIType<T> = T extends UI<infer U> ? U : T extends Modify<infer U> ? U : never;

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
    addMapping(mapping?: Array<ButtonMapping> | ButtonMapping): OverrideInterface;
    addVariables(variables?: VariablesInterface): OverrideInterface;
    addAnimation(animation?: Animation, startIndex?: number): OverrideInterface;
    searchBinding(bindingName: BindingName, controlName: string): any;
    sourceBindings: Record<string, string>;
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
