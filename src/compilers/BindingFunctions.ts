import {
    Binding,
    CurrentLine,
    Log,
    ModificationBindingsInterface,
    UI,
} from "../";
// import { API } from "../compoments/API";
import { Class } from "../compoments/Class";
import { Items } from "../compoments/ItemDatas";
import { OverrideInterface } from "../compoments/Modify";
import { Random } from "../compoments/Random";
import { BindingCompiler, BindingFunctionObject } from "./BindingCompiler";

export const funcObj: BindingFunctionObject = {
    sum: (arg, params) => {
        const bindingName = Random.bindingName();
        arg.addBindings({
            source_property_name: `(${params.join(" + ")})`,
            target_property_name: bindingName,
        });
        return bindingName;
    },

    sumAvg: (arg, params) => {
        const bindingName = Random.bindingName();

        arg.addBindings({
            source_property_name: `((${params.join(" + ")}) / ${
                params.length
            })`,
            target_property_name: bindingName,
        });

        return bindingName;
    },

    max: (arg, params) => {
        let current: Binding = <any>params[0];

        for (const nextBinding of params.slice(1)) {
            arg.addBindings({
                source_property_name: [
                    `(${current} >= ${nextBinding}) * ${current} + (${current} < ${nextBinding}) * ${nextBinding}`,
                ],
                target_property_name: (current = Random.bindingName()),
            });
        }

        return current;
    },

    min: (arg, params) => {
        let current: Binding = <any>params[0];

        for (const nextBinding of params.slice(1)) {
            arg.addBindings({
                source_property_name: [
                    `(${current} <= ${nextBinding}) * ${current} + (${current} > ${nextBinding}) * ${nextBinding}`,
                ],
                target_property_name: (current = Random.bindingName()),
            });
        }

        return current;
    },

    abs: (arg, [binding]) => {
        const bindingName = Random.bindingName();
        arg.addBindings({
            source_property_name: `((-1 + (${binding} > 0) * 2) * ${binding})`,
            target_property_name: bindingName,
        });
        return bindingName;
    },

    isEven: (arg, params) => {
        const bindingName = Random.bindingName();
        if (params.length > 1) {
            params.map((binding) => {
                const bindingName = Random.bindingName();
                arg.addBindings({
                    source_property_name: [`(${binding} % 2) == 0`],
                    target_property_name: bindingName,
                });
                return bindingName;
            });
            arg.addBindings({
                source_property_name: `(${params.join(" and ")})`,
                target_property_name: bindingName,
            });
        } else {
            arg.addBindings({
                source_property_name: [`(${params[0]} % 2) == 0`],
                target_property_name: bindingName,
            });
        }

        return bindingName;
    },

    isOdd: (arg, params) => {
        const bindingName = Random.bindingName();
        if (params.length > 1) {
            params.map((binding) => {
                const bindingName = Random.bindingName();
                arg.addBindings({
                    source_property_name: [`(${binding} % 2) == 1`],
                    target_property_name: bindingName,
                });
                return bindingName;
            });
            arg.addBindings({
                source_property_name: `(${params.join(" and ")})`,
                target_property_name: bindingName,
            });
        } else {
            arg.addBindings({
                source_property_name: [`(${params[0]} % 2) == 1`],
                target_property_name: bindingName,
            });
        }

        return bindingName;
    },

    getItemID: (arg, [identification]) => {
        const bindingName: any = Random.bindingName();

        arg.setProperties({
            property_bag: {
                [bindingName]: Items.getID(identification),
            },
        });

        return bindingName;
    },

    getItemAuxID: (arg, [identification]) => {
        const bindingName: any = Random.bindingName();

        arg.setProperties({
            property_bag: {
                [bindingName]: Items.getAuxID(identification),
            },
        });

        return bindingName;
    },

    int: (arg, [float, intLength]) => {
        const sumBnd: Array<string> = [];
        const _intLength = Number.isNaN(+intLength) ? -1 : +intLength;
        let bindingName: any = Random.bindingName();

        if (_intLength < 0) {
            arg.setProperties({
                property_bag: {
                    [bindingName]: 0,
                },
            });

            arg.addBindings({
                source_property_name: `(${bindingName} + (${bindingName} < ${float}) - (${bindingName} > ${float}))`,
                target_property_name: bindingName,
            });
        } else {
            let calcBindingName: any = Random.bindingName();

            arg.addBindings({
                source_property_name: [`abs(${float})`],
                target_property_name: <any>(
                    (calcBindingName = Random.bindingName())
                ),
            });

            for (let i = _intLength - 1; i >= 0; i--) {
                arg.addBindings({
                    source_property_name: `(${eval(`1e${i}`)} * (${Array.from(
                        {
                            length: 10,
                        },
                        (v, c) =>
                            `(${calcBindingName} > ${
                                eval(`${c + 1}e${i}`) - 1
                            })`
                    ).join(" + ")}))`,
                    target_property_name: <any>(
                        (bindingName = Random.bindingName())
                    ),
                });
                sumBnd.push(bindingName);
                if (i !== 0)
                    arg.addBindings({
                        source_property_name: `(${calcBindingName} - ${bindingName})`,
                        target_property_name: <any>(
                            (calcBindingName = Random.bindingName())
                        ),
                    });
            }

            arg.addBindings([
                {
                    source_property_name: `(${sumBnd.join(" + ")})`,
                    target_property_name: <any>(
                        (bindingName = Random.bindingName())
                    ),
                },
                {
                    source_property_name: `(${bindingName} * (1 - (${float} < 0) * 2))`,
                    target_property_name: <any>(
                        (bindingName = Random.bindingName())
                    ),
                },
            ]);
        }

        return bindingName;
    },

    array: (arg, params) => {
        const bindingName: any = Random.bindingName(),
            arrayBindingName: any = Random.bindingName();

        const accessIndex = params[0];
        const arrayItems = params.slice(1);

        arg.addBindings([
            ...arrayItems.map((v, i) => ({
                source_property_name: BindingCompiler.checkAndBuild(v, arg),
                target_property_name: <any>`${arrayBindingName}${i}`,
            })),
            {
                source_property_name: [
                    `'${arrayBindingName}{${BindingCompiler.checkAndBuild(
                        accessIndex,
                        arg
                    )}}'`,
                ],
                target_property_name: bindingName,
            },
        ]);

        return bindingName;
    },

    getPrefix: (arg, [str, strLength = 0]) => {
        const bindingName: any = Random.bindingName();

        if (
            !(
                BindingCompiler.isString(str) ||
                BindingCompiler.isHasBinding(str)
            )
        )
            str = `'${str}'`;

        arg.addBindings({
            source_property_name: [
                Number.isNaN(+strLength)
                    ? `'%.{ ${strLength} }s' * ${str}`
                    : `'%.${strLength}s' * ${str}`,
            ],
            target_property_name: bindingName,
        });

        return bindingName;
    },

    slice: (arg, [str, start, end]) => {
        const bindingName: any = Random.bindingName();

        if (
            !(
                BindingCompiler.isString(str) ||
                BindingCompiler.isHasBinding(str)
            )
        )
            str = `'${str}'`;

        if (end) {
            arg.addBindings({
                source_property_name: [
                    ` '%.{${end} - ${start}}s' * slice(${str}, ${start}) `,
                ],
                target_property_name: bindingName,
            });
        } else {
            arg.addBindings({
                source_property_name: [
                    Number.isNaN(+start)
                        ? ` 'prefix{ ${str} }' - 'prefix{ '%.{ ${start} }s' * ${str} }' `
                        : ` 'prefix{ ${str} }' - 'prefix{ '%.${start}s' * ${str} }' `,
                ],
                target_property_name: bindingName,
            });
        }

        return bindingName;
    },

    getAfterPrefix: (arg, [str, str2, prefix, maxLength = 30]) => {
        const bindingName: any = Random.bindingName();

        arg.addBindings({
            source_property_name: `(${prefix} + ${str} - ${Array.from(
                { length: +maxLength },
                (v, i) => `('%.${i + 1}s' * ${str} + ${str2})`
            ).join(" - ")} )`,
            target_property_name: bindingName,
        });

        return bindingName;
    },

    getAfter: (arg, [str, str2, maxLength = 30]) => {
        const bindingName: any = Random.bindingName();

        arg.addBindings({
            source_property_name: `( ${str} - ${Array.from(
                { length: +maxLength },
                (v, i) => `('%.${i + 1}s' * ${str} + ${str2})`
            ).join(" - ")} )`,
            target_property_name: bindingName,
        });

        return bindingName;
    },

    getBefore: (arg, [str, str2, maxLength = 30]) => {
        const bindingName: any = Random.bindingName();

        arg.addBindings({
            source_property_name: [
                ` ${str} - '{${str2}}{getAfter(${str}, ${str2}, ${maxLength})}' `,
            ],
            target_property_name: bindingName,
        });

        return bindingName;
    },

    exclude: (arg, [str, excStr]) => {
        const bindingName: any = Random.bindingName();

        arg.addBindings({
            source_property_name: `((${str} - ${excStr}) = ${str})`,
            target_property_name: bindingName,
        });

        return bindingName;
    },

    pow: (arg, [num1, num2]) => {
        const bindingName: any = Random.bindingName();

        if (BindingCompiler.isNumber(num2)) {
            const $2 = +num2;

            if (BindingCompiler.isNumber(num1)) return Math.pow(+num1, $2);
            else {
                if ($2 === 0) return 1;
                else if ($2 > 0)
                    return Array.from({ length: $2 }, () => num1).join(" * ");
                else
                    return `1 / ${Array.from(
                        { length: $2 * -1 },
                        () => num1
                    ).join(" / ")}`;
            }
        } else {
            for (let i = 1; i <= 32; i++) {
                arg.addBindings({
                    source_property_name: `(${num2} / ((${num1} < ${i}) * ${num2}))`,
                    target_property_name: <any>`${bindingName}${i}`,
                });

                arg.addBindings({
                    source_property_name: `(${num2} / ((${num1} > ${
                        i * -1
                    }) * ${num2}))`,
                    target_property_name: <any>`${bindingName}_${i}`,
                });
            }

            arg.addBindings({
                source_property_name: `( ${Array.from(
                    { length: 32 },
                    (v, i) => `${bindingName}${i + 1}`
                ).join(" * ")} / ${Array.from(
                    { length: 32 },
                    (v, i) => `${bindingName}_${i + 1}`
                ).join(" / ")})`,
                target_property_name: bindingName,
            });
        }

        return bindingName;
    },

    sqrt: (arg, [num]) => {
        const bindingName: any = Random.bindingName();

        if (BindingCompiler.isNumber(num)) {
            return `${Math.sqrt(+num)}`;
        } else {
            const binding2: any = Random.bindingName();

            const x = 100;

            arg.addBindings([
                {
                    source_property_name: `(${num} * ${x} / 2)`,
                    target_property_name: bindingName,
                },
                {
                    source_property_name: `[ abs((${bindingName} * ${bindingName}) - ${num}) > 1 ]`,
                    target_property_name: binding2,
                },
                {
                    source_property_name: `( (${num} < 0) * -1 + (${num} > -1) * (${binding2} * ((${bindingName} + ${num} / ${bindingName}) / 2) + (not ${binding2}) * ${bindingName}) )`,
                    target_property_name: bindingName,
                },
            ]);
        }

        return bindingName;
    },

    // sin: (arg, [deg]) => {
    //     const bindingName: any = Random.bindingName();

    //     if (BindingCompiler.isNumber(deg))
    //         return `${(Math.sin((Math.PI * +deg) / 180) * 1000).toFixed(0)}`;
    //     else {
    //         API.sinTable.create(arg);

    //         const bn: any = Random.bindingName();

    //         arg.addBindings([
    //             {
    //                 source_property_name: `[ ${deg} % 360 ]`,
    //                 target_property_name: bn,
    //             },
    //             {
    //                 source_property_name: `[ '#deg_base:{ (${bn} < 0) * (${bn} + 360) + (${bn} > -1) * ${bn} }' ]`,
    //                 target_property_name: bindingName,
    //             },
    //         ]);
    //     }

    //     return bindingName;
    // },

    // cos: (arg, [deg]) => {
    //     if (BindingCompiler.isNumber(deg))
    //         return `${(Math.cos((Math.PI * +deg) / 180) * 1000).toFixed(0)}`;
    //     else return BindingCompiler.checkAndBuild(`sin(90 - ${deg})`, arg);
    // },

    // tan: (arg, [deg]) => {
    //     if (BindingCompiler.isNumber(deg))
    //         return `${(Math.tan((Math.PI * +deg) / 180) * 1000).toFixed(0)}`;
    //     else {
    //         const bindingName: any = Random.bindingName();
    //         const cos: any = Random.bindingName();

    //         arg.addBindings([
    //             {
    //                 source_property_name: `[ cos(${deg}) ]`,
    //                 target_property_name: cos,
    //             },
    //             {
    //                 source_property_name: `[ (${cos} == 0) * -1 + (${cos} != 0) * (sin(${deg}) * 1000 / ${cos}) ]`,
    //                 target_property_name: bindingName,
    //             },
    //         ]);

    //         return bindingName;
    //     }
    // },

    // cot: (arg, [deg]) => {
    //     if (BindingCompiler.isNumber(deg))
    //         return `${((1 / Math.tan((Math.PI * +deg) / 180)) * 1000).toFixed(
    //             0
    //         )}`;
    //     else {
    //         const bindingName: any = Random.bindingName();
    //         const sin: any = Random.bindingName();

    //         arg.addBindings([
    //             {
    //                 source_property_name: `[ sin(${deg}) ]`,
    //                 target_property_name: sin,
    //             },
    //             {
    //                 source_property_name: `[ (${sin} == 0) * -1 + (${sin} != 0) * (cos(${deg}) * 1000 / ${sin}) ]`,
    //                 target_property_name: bindingName,
    //             },
    //         ]);

    //         return bindingName;
    //     }
    // },
};

export type BindingFunctionsCallback<
    T = UI | OverrideInterface | ModificationBindingsInterface
> = (element: T, params: Array<string>) => Binding | string;

export class BindingFunctions extends Class {
    static register<T = UI | OverrideInterface | ModificationBindingsInterface>(
        name: string,
        callback: BindingFunctionsCallback<T>,
        override?: boolean
    ) {
        const n = name;
        if (override || !funcObj[n]) {
            funcObj[n] = <any>callback;
        } else
            Log.error(
                `${CurrentLine()} '${n}' function already exists, do you want to override it?`
            );
    }
}
