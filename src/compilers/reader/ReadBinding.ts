import { OverrideInterface } from "../../components/Modify";
import { UI } from "../../components/UI";
import { BindingName } from "../../types/enums/BindingName";
import { BindingType } from "../../types/enums/BindingType";
import { BindingInterface } from "../../types/objects/BindingInterface";
import { Var } from "../../types/values/Variable";
import { BindingCompiler } from "../BindingCompiler";
import { Log } from "../generator/Log";
import { CurrentLine } from "./CurrentLine";

/**
 * Reads and processes a binding object or name and returns a properly structured binding object.
 *
 * This function checks the type of the provided `binding` argument and processes it accordingly:
 * - If the `binding` is a string, it returns an object with a `binding_name` property.
 * - If the `binding` is an object (either `BindingName | Var | BindingInterface`), it checks for specific properties like `source_property_name`
 *   or `binding_collection_name` and adjusts the binding accordingly.
 * - If the `source_property_name` is an array, it compiles it using the `BindingCompiler.compile` method.
 *
 * @param {BindingName | Var | BindingInterface} binding - The binding to be read. Can be a string or an object of type `BindingName`, `Var`, or `BindingInterface`.
 * @param {UI | OverrideInterface} arg - An additional argument used in the processing of the `binding` object.
 *
 * @returns {BindingInterface} The processed binding object.
 *
 * @example
 * // Example usage:
 * const result = ReadBinding("myBindingName", someUIObject);
 * console.log(result); // { binding_name: "myBindingName" }
 *
 * const bindingObj = { source_property_name: ["property1"], source_control_name: "control1" };
 * const result = ReadBinding(bindingObj, someOverrideObject);
 * console.log(result); // Processed binding object with necessary adjustments
 */
export function ReadBinding(
    binding: BindingName | Var | BindingInterface,
    arg: UI | OverrideInterface
): BindingInterface {
    if (typeof binding === "string")
        return {
            binding_name: binding,
        };
    else {
        const bindingObject: BindingInterface = <any>binding;

        if (bindingObject.source_property_name) {
            bindingObject.binding_type ||= BindingType.View;

            const srcBin = bindingObject.source_property_name;

            if (srcBin && !bindingObject.source_control_name) {
                if (Array.isArray(srcBin))
                    bindingObject.source_property_name = <any>(
                        BindingCompiler.compile(srcBin[0], arg)
                    );
                else if (srcBin.startsWith("[") && srcBin.endsWith("]")) {
                    bindingObject.source_property_name = BindingCompiler.compile(
                        srcBin.slice(1, srcBin.length - 1),
                        arg
                    );
                }
            }

            if (!bindingObject.target_property_name) {
                Log.error(`${CurrentLine()} missing target_property_name.`);
            }
        } else if (bindingObject.binding_collection_name) {
            bindingObject.binding_type ||= BindingType.Collection;
        }

        return <BindingInterface>bindingObject;
    }
}
