import { OverrideInterface } from "../../components/Modify";
import { UI } from "../../components/UI";
import { BindingName } from "../../types/enums/BindingName";
import { BindingType } from "../../types/enums/BindingType";
import { BindingInterface } from "../../types/objects/BindingInterface";
import { Var } from "../../types/values/Variable";
import { BindingCompiler } from "../BindingCompiler";
import { Log } from "../generator/Log";
import { CurrentLine } from "./CurrentLine";

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

            if (srcBin && BindingCompiler.isCanCompile(srcBin)) {
                if (bindingObject.source_control_name) {
                    const srcControlName = <string>bindingObject.source_control_name;

                    delete bindingObject.source_control_name;
                    const newBindings = BindingCompiler.findSourceBindings(BindingCompiler.getCompilePart(srcBin), srcControlName, arg.sourceBindings);
                    for (const key in newBindings.reSourceBindings) arg.sourceBindings[key] = newBindings.reSourceBindings[key];

                    bindingObject.source_property_name = BindingCompiler.compile(`[${newBindings.newTokens.join("")}]`, arg);
                } else bindingObject.source_property_name = BindingCompiler.compile(srcBin, arg);
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
