import fs from "fs";
import { safeWriteFile } from "../lib/writeFile";

interface SpaceCode {
    [name: string]: {
        extend?: {
            namespace?: string;
            name?: string;
        };
        type: string;
        file: string;
        childs?: string[];
    };
}

interface ScanCode {
    [namespace: string]: SpaceCode;
}

{
    const scanner: ScanCode = {};

    const fileList = (() => {
        return fs
            .readdirSync(".Vanilla", {
                recursive: true,
                withFileTypes: true,
            })
            .filter(file => file.isFile())
            .map(file => `${file.parentPath}/${file.name}`);
    })();

    interface SplitElementName {
        name: string;
        namespace?: string;
        targetName?: string;
    }

    function splitElementName(name: string) {
        const [elementName, extend]: Array<string> = name.split("@");

        const splitName: SplitElementName = {
            name: elementName,
            targetName: undefined,
            namespace: undefined,
        };

        if (extend) {
            const arr = extend.split(".");

            if (arr.length === 1) {
                splitName.targetName = arr[0];
            } else if (arr.length === 2) {
                splitName.namespace = arr[0];
                splitName.targetName = arr[1];
            }
        }

        return splitName;
    }

    function scanJsonUICode(namespace: string, code: any, path: string = "", file: string) {
        const childName: string[] = [];
        const controls = code.controls;
        const _namespace = namespace;

        if (controls) {
            for (const elementObject of controls) {
                const key = Object.keys(elementObject)[0];
                const _code = elementObject[key];

                const { name, namespace = _namespace, targetName } = splitElementName(key);

                const fullName = `${path}/${name}`;

                if (targetName) {
                    scanner[_namespace][fullName] = {
                        extend: <any>(targetName
                            ? {
                                namespace: namespace,
                                name: targetName,
                            }
                            : undefined),
                        type: _code.type,
                        file,
                    };
                } else {
                    scanner[_namespace][fullName] = {
                        type: _code.type,
                        file,
                    };
                }

                if (_code.controls) {
                    const childList = scanJsonUICode(_namespace, _code, fullName, file);
                    scanner[_namespace][fullName].childs = childList;
                }

                childName.push(name);
            }
        } else {
            scanner[namespace] = {};

            for (const key in code) {
                const _code = code[key];
                const { name, namespace = _namespace, targetName } = splitElementName(key);

                if (_code.anim_type) {
                    continue;
                }
                if (targetName) {
                    scanner[_namespace][name] = {
                        extend: <any>(targetName
                            ? {
                                namespace: namespace,
                                name: targetName,
                            }
                            : undefined),
                        type: _code.type,
                        file,
                    };
                } else {
                    scanner[_namespace][name] = {
                        type: _code.type,
                        file,
                    };
                }

                if (_code.controls) {
                    const childList = scanJsonUICode(_namespace, _code, name, file);
                    scanner[_namespace][name].childs = childList;
                }
            }
        }

        return childName;
    }

    for (const file of fileList) {
        const jsonCode = JSON.parse(fs.readFileSync(file, "utf-8"));
        const namespace = jsonCode.namespace;
        const uiPath = file.replaceAll("\\", "/").replace(/^\.Vanilla\//, "");
        delete jsonCode.namespace;

        scanJsonUICode(namespace, jsonCode, "", uiPath);
    }

    function findElementType(name: string, namespace: string) {
        try {
            const e = scanner[namespace][name];

            if (e.type) return e.type;
            else {
                const type = findElementType(e.extend?.name!, e.extend?.namespace!);
                scanner[namespace][name].type = type;
                return type;
            }
        } catch (error) {
            return "panel";
        }
    }

    for (const namespace in scanner) {
        for (const elementPath in scanner[namespace]) {
            const { extend, type } = scanner[namespace][elementPath];

            if (!type) {
                scanner[namespace][elementPath].type = findElementType(
                    extend?.name!,
                    extend?.namespace!
                )!;
            }
        }
    }

    fs.writeFileSync("ui.d.json", JSON.stringify(scanner, null, 4));
}

{
    const imports: string = [
        'import { PropertiesType } from "./../types/objects/elements/PropertiesType";',
        'import { Types } from "./../types/enums/Types";',
        'import { Modify } from "./Modify";',
        'import { Class } from "./Class";',
    ].join("\n");
    const writeDir = "src/components";

    const ui: ScanCode = JSON.parse(fs.readFileSync("ui.d.json", "utf-8"));

    let build = `${imports}\n\n`;
    4;

    let cls = `export class Vanilla extends Class {\n`;

    for (const namespace in ui) {
        const SpaceElement: { name: string; file: string }[] = [];

        if (namespace === "undefined") continue;

        const Namespace = `_${namespace}`.replace(/(_|-)\w/g, str => str.slice(1).toUpperCase());

        let code = `class ${Namespace} extends Class {\n`;

        for (const element in ui[namespace]) {
            const { type, file, childs } = ui[namespace][element];

            const e = element
                .replace(/_\w/g, str => str.slice(1).toUpperCase())
                .replaceAll("/", "_");

            code += `    static ${/^\d/.test(e) ? `_${e}` : e
                }<T extends Types = Types.${`_${type}`.replaceAll(/_\w/g, v =>
                    v.slice(1).toUpperCase()
                )}>(properties?: PropertiesType[T]) {
        return Modify.registerWithNamespace<T${childs?.length ? `, ${childs.map(v => `"${v}"`).join(" | ")}` : ""
                }>("${file}", "${element}", "${namespace}", <any>properties)
    }\n`;

            SpaceElement.push({ name: element, file });
        }

        code += "}\n\n";
        build += code;
        cls += `    static ${Namespace[0].toLowerCase()}${Namespace.slice(1)} = ${Namespace};\n`;
    }
    cls += `}`;

    safeWriteFile(`${writeDir}/Vanilla.ts`, `${build}\n\n${cls}`);
}
