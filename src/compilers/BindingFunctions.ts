import { Class } from "../components/Class";
import { ModificationBindingsInterface, OverrideInterface } from "../components/Modify";
import { Random } from "../components/Random";
import { UI } from "../components/UI";
import { Binding } from "../types/values/Binding";
import { BindingCompiler, BindingFunctionObject } from "./BindingCompiler";
import { Log } from "./generator/Log";
import { CurrentLine } from "./reader/CurrentLine";

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
            source_property_name: `((${params.join(" + ")}) / ${params.length})`,
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
            params.map(binding => {
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
            params.map(binding => {
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
                target_property_name: <any>(calcBindingName = Random.bindingName()),
            });

            for (let i = _intLength - 1; i >= 0; i--) {
                arg.addBindings({
                    source_property_name: `(${Math.pow(10, i)} * (${Array.from(
                        {
                            length: 10,
                        },
                        (v, c) => `(${calcBindingName} > ${(c + 1) * Math.pow(10, i) - 1})`
                    ).join(" + ")}))`,
                    target_property_name: <any>(bindingName = Random.bindingName()),
                });
                sumBnd.push(bindingName);
                if (i !== 0)
                    arg.addBindings({
                        source_property_name: `(${calcBindingName} - ${bindingName})`,
                        target_property_name: <any>(calcBindingName = Random.bindingName()),
                    });
            }

            arg.addBindings([
                {
                    source_property_name: `(${sumBnd.join(" + ")})`,
                    target_property_name: <any>(bindingName = Random.bindingName()),
                },
                {
                    source_property_name: `(${bindingName} * (1 - (${float} < 0) * 2))`,
                    target_property_name: <any>(bindingName = Random.bindingName()),
                },
            ]);
        }

        return bindingName;
    },

    slice: (arg, [str, start, end]) => {
        const bindingName: any = Random.bindingName();
        if (!(BindingCompiler.isString(str) || BindingCompiler.isHasBinding(str))) str = `'${str}'`;
        if (end) {
            arg.addBindings({
                source_property_name: [` '%.{${end} - ${start}}s' * slice(${str}, ${start}) `],
                target_property_name: bindingName,
            });
        } else {
            arg.addBindings({
                source_property_name: [
                    Number.isNaN(+start)
                        ? ` '__START__{ ${str} }' - '__START__{ '%.{ ${start} }s' * ${str} }' `
                        : ` '__START__{ ${str} }' - '__START__{ '%.${start}s' * ${str} }' `,
                ],
                target_property_name: bindingName,
            });
        }
        return bindingName;
    },

    getAfterString: (arg, [str, afterStr]) => {
        const returnBinding = Random.bindingName();
        const startMark = "__START__";

        arg.addBindings({
            source_property_name: `[ '${startMark}{${str}}' - ('${startMark}{ '%.{ find(${str}, ${afterStr}) }s' * ${str} }' + ${afterStr}) ]`,
            target_property_name: returnBinding,
        });

        return returnBinding;
    },

    getBeforeString: (arg, [str, beforeStr]) => {
        const bindingName: any = Random.bindingName();

        arg.addBindings({
            source_property_name: `[ '%.{ find(${str}, ${beforeStr}) }s' * ${str} ]`,
            target_property_name: bindingName,
        })

        return bindingName;
    },

    pow: (arg, [num1, num2]) => {
        const bindingName: any = Random.bindingName();

        if (BindingCompiler.isNumber(num2)) {
            const $2 = +num2;

            if (BindingCompiler.isNumber(num1)) return Math.pow(+num1, $2);
            else {
                if ($2 === 0) return 1;
                else if ($2 > 0) return Array.from({ length: $2 }, () => num1).join(" * ");
                else return `1 / ${Array.from({ length: $2 * -1 }, () => num1).join(" / ")}`;
            }
        } else {
            for (let i = 1; i <= 32; i++) {
                arg.addBindings({
                    source_property_name: `(${num2} / ((${num1} < ${i}) * ${num2}))`,
                    target_property_name: <any>`${bindingName}${i}`,
                });

                arg.addBindings({
                    source_property_name: `(${num2} / ((${num1} > ${i * -1}) * ${num2}))`,
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

    length: (arg, [str]) => {
        // Binding name
        const cutToIndex = Random.bindingName();
        const fixString = Random.bindingName();
        const cutString = Random.bindingName();

        // Special value
        const startMark = "__START__";
        const endMark = "__END__";

        arg.addBindings([
            {
                source_property_name: [` '${startMark}{ ${str} }${endMark}' `],
                target_property_name: fixString
            },
            {
                source_property_name: [` '${startMark}{  '%.{ 0 + ${cutToIndex} }s' * ${str}  }${endMark}' `],
                target_property_name: cutString
            },
            {
                source_property_name: `(${cutToIndex} + (not (${fixString} = ${cutString})))`,
                target_property_name: cutToIndex
            }
        ]);

        return cutToIndex;
    },

    find: (arg, [str, findStr]) => {
        // Binding name
        const markString = Random.bindingName();
        const cutToIndex = Random.bindingName();
        const cutString = Random.bindingName();
        const isNotIncludes = Random.bindingName();
        const returnBinding = Random.bindingName();

        // Special value
        const startMark = "__START__";
        const endMark = "__END__";

        arg.addBindings([
            {
                source_property_name: [` '${startMark}{${str}}${endMark}' `],
                target_property_name: markString
            },
            {
                source_property_name: `((${str} - ${findStr}) = ${str})`,
                target_property_name: isNotIncludes
            },
            {
                source_property_name: [` '${startMark}{ '%.{ 0 + ${cutToIndex} }s' * ${str} }' + ${findStr} `],
                target_property_name: cutString
            },
            {
                source_property_name: `(${cutToIndex} + (${markString} = (${markString} - ${cutString})))`,
                target_property_name: cutToIndex
            },
            {
                source_property_name: `((not ${isNotIncludes}) * ${cutToIndex} + (${isNotIncludes} * -1))`,
                target_property_name: returnBinding
            }
        ]);

        return returnBinding;
    },
};

export type BindingFunctionsCallback<T = UI | OverrideInterface | ModificationBindingsInterface> = (
    element: T,
    params: Array<string>
) => Binding | string;

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
