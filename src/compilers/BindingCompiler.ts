import { OverrideInterface } from "../components/Modify";
import { Random } from "../components/Random";
import { UI } from "../components/UI";
import { Binding } from "../types/values/Binding";
import { funcObj } from "./BindingFunctions";
import { Log } from "./generator/Log";
import { CurrentLine } from "./reader/CurrentLine";

export interface BindingFunctionObject {
    [key: string]: (arg: UI | OverrideInterface, params: Array<string>) => Binding;
}
export class BindingCompiler {
    static compile(propertyName: string | string[], arg: UI | OverrideInterface) {
        return this.build(this.getCompilePart(propertyName), arg).replace(/__BREAK_LINE__/g, "\n");
    }

    static getCompilePart(propertyName: string | string[]) {
        return Array.isArray(propertyName) ? propertyName[0] : propertyName.slice(1, propertyName.length - 1)
    }

    static build(propertyName: string, arg: UI | OverrideInterface) {
        const tokens = this.lexer(propertyName, arg);

        let build = "(";

        for (let index = 0; index < tokens.length; index++) {
            let token = tokens[index];

            if (this.isScientificNotation(token)) {
                const [left, right] = token.split("e");
                token = "" + Number(left) * Math.pow(10, Number(right));
            }

            if (token === "!") build += "not ";
            else {
                if (
                    this.isNegativeNumber(token) &&
                    !this.isOperator(tokens[index - 1]) &&
                    tokens[index - 1] !== undefined
                ) {
                    build += `- ${token.slice(1)} `;
                } else build += `${token} `;
            }
        }

        build = `${build.slice(0, build.length - 1)})`;

        return build;
    }

    static buildNewPropertyBag(token: string, arg: UI | OverrideInterface) {
        const bindingName: any = `#${Random.getName()}`;
        arg.setProperties({
            property_bag: {
                [bindingName]: BindingCompiler.build(token, arg),
            },
        });
        return bindingName;
    }

    static checkAndBuild(token: string, arg: UI | OverrideInterface) {
        return this.isHasBinding(token)
            ? this.build(token, arg)
            : this.buildNewPropertyBag(token, arg);
    }

    static compileSpecialOperator(tokens: Array<string>, arg: UI | OverrideInterface) {
        let firstTokens: Array<string> = [];

        if (tokens.includes("?")) {
            const startIndex = tokens.indexOf("?");
            firstTokens.push(...tokens.slice(0, startIndex));

            let elseCount = 0;

            const secondTokens: Array<string> = [];
            const thirdTokens: Array<string> = [];

            let questionCount = 1;
            let endIndex = -1;

            for (let index = startIndex + 1; index < tokens.length; index++) {
                const token = tokens[index];

                if (token === "?") questionCount++;
                else if (token === ":" && --questionCount == 0) {
                    endIndex = index;
                    elseCount++;
                    break;
                }

                secondTokens.push(token);
            }

            thirdTokens.push(...tokens.slice(endIndex + 1));

            const generateBindingName = `#${Random.getName()}`;
            const firstBinding = this.checkAndBuild(firstTokens.join(""), arg);
            const secondBinding = `${generateBindingName}true`;
            const thirdBinding = `${generateBindingName}false`;

            arg.addBindings([
                {
                    source_property_name: this.checkAndBuild(secondTokens.join(""), arg),
                    target_property_name: <any>secondBinding,
                },
                {
                    source_property_name: [`'${generateBindingName}{${firstBinding}}'`],
                    target_property_name: <any>generateBindingName,
                },
            ]);

            if (elseCount !== 0) {
                arg.addBindings({
                    source_property_name: this.checkAndBuild(thirdTokens.join(""), arg),
                    target_property_name: <any>thirdBinding,
                });
            }

            return [generateBindingName];
        } else if (tokens.includes("==")) {
            const preBuild: Array<string> = [];

            let strToken: Array<string> = [];

            for (const token of tokens) {
                if (token === "==") {
                    const binding = this.buildNewBinding(strToken.join(""), arg);
                    strToken = [];
                    preBuild.push(...[binding, "="]);
                } else {
                    strToken.push(token);
                }
            }

            preBuild.push(this.buildNewBinding(strToken.join(""), arg));
            strToken = [];

            const build: Array<string> = [];

            for (let i = 0; i < preBuild.length; i++) {
                if (preBuild[i] === "=") {
                    if (build.length > 0) build.push("&");

                    const [preToken, token, nextToken] = [
                        preBuild[i - 1],
                        preBuild[i],
                        preBuild[i + 1],
                    ];
                    build.push(this.buildNewBinding(`${preToken} ${token} ${nextToken}`, arg));
                }
            }

            return build;
        } else {
            for (let index = 0; index < tokens.length; index++) {
                const token = tokens[index];

                if (["&&", "||", "&", "|"].includes(token)) {
                    const secondTokens = tokens.slice(index + 1);

                    const firstBinding =
                        firstTokens.length === 1
                            ? firstTokens[0]
                            : this.buildNewBinding(firstTokens.join(" "), arg);

                    const secondBinding =
                        secondTokens.length === 1
                            ? secondTokens[0]
                            : this.buildNewBinding(tokens.slice(index + 1).join(" "), arg);

                    return [
                        firstBinding,
                        ["&&", "&"].includes(token) ? "and" : "or",
                        secondBinding,
                    ];
                } else firstTokens.push(token);
            }

            firstTokens = firstTokens.slice(firstTokens.length);

            for (let index = 0; index < tokens.length; index++) {
                const token = tokens[index];
                if (["%", ">=", "<=", "!="].includes(token)) {
                    const secondTokens = tokens.slice(index + 1);

                    const firstBinding =
                        firstTokens.length === 1
                            ? firstTokens[0]
                            : this.buildNewBinding(firstTokens.join(""), arg);

                    const secondBinding =
                        secondTokens.length === 1
                            ? secondTokens[0]
                            : this.buildNewBinding(tokens.slice(index + 1).join(""), arg);

                    switch (token) {
                        case ">=": {
                            return [
                                "(",
                                firstBinding,
                                ">",
                                secondBinding,
                                ")",
                                "or",
                                "(",
                                firstBinding,
                                "=",
                                secondBinding,
                                ")",
                            ];
                        }
                        case "<=": {
                            return [
                                "(",
                                firstBinding,
                                "<",
                                secondBinding,
                                ")",
                                "or",
                                "(",
                                firstBinding,
                                "=",
                                secondBinding,
                                ")",
                            ];
                        }
                        case "!=": {
                            return [
                                "not",
                                this.buildNewBinding(`${firstBinding} = ${secondBinding}`, arg),
                            ];
                        }
                        case "%": {
                            return [
                                firstBinding,
                                "-",
                                firstBinding,
                                "/",
                                secondBinding,
                                "*",
                                secondBinding,
                            ];
                        }
                    }
                } else firstTokens.push(token);
            }
        }

        return firstTokens;
    }

    static lexer(propertyName: string, arg: UI | OverrideInterface) {
        const getTokens = this.compileSpecialOperator(
            this.readTokens(this.getTokens(this.splitString(propertyName))).map(token => {
                if (this.isCodeBlock(token))
                    return <string>this.buildNewBinding(token.slice(1, token.length - 1), arg);
                else if (this.isFunction(token)) {
                    return <string>this.functionHandler(token, arg);
                } else if (this.isString(token)) {
                    return <string>this.stringHandler(token, arg);
                } else return token;
            }),
            arg
        );

        return getTokens;
    }

    static splitString(propertyName: string) {
        const tokens: Array<string> = [];
        let token = "",
            openFormatCount = 0,
            isString: boolean = false;

        for (const char of propertyName) {
            if (char === "'" && openFormatCount === 0) {
                isString = !isString;

                if (token !== "" || !isString) tokens.push(isString ? token : `'${token}'`);

                token = "";
            } else if (char === "\n" && isString) {
                token += "__BREAK_LINE__";
            } else if (char === "{" && isString) {
                openFormatCount++;
                token += "{";
            } else if (char === "}" && isString) {
                openFormatCount--;
                token += "}";
            } else if (char !== " " || isString) {
                token += char;
            }
        }

        if (token !== "") tokens.push(token);
        return tokens;
    }

    static stringHandler(token: string, arg: UI | OverrideInterface) {
        const tokens = this.getStringTokens(token.slice(1, token.length - 1))
            .map(token => {
                if (this.isStringCode(token))
                    return BindingCompiler.build(token.slice(1, token.length - 1), arg);
                else return `'${token}'`;
            })
            .filter(token => !["'{}'", ")"].includes(token));
        return tokens.length > 1 ? `(${tokens.join(" + ")})` : tokens[0] || "''";
    }

    static getStringTokens(token: string) {
        const tokens: Array<string> = [];
        let bracketsCount = 0,
            strToken = "";

        for (const char of token) {
            if (char === "{") {
                if (bracketsCount++ === 0 && strToken !== "") {
                    tokens.push(strToken);
                    strToken = "";
                }
                strToken += char;
            } else if (char === "}") {
                strToken += char;
                if (--bracketsCount === 0 && strToken !== "") {
                    tokens.push(strToken);
                    strToken = "";
                }
            } else strToken += char;
        }

        if (strToken !== "") tokens.push(strToken);

        return tokens;
    }

    static functionHandler(token: string, arg: UI | OverrideInterface) {
        const func = this.readFunctionFromToken(this.getTokens(this.splitString(token)), arg);

        let str: string = "";

        if (funcObj[func.name]) {
            str = <string>funcObj[func.name](
                arg,
                func.params.map(token => {
                    token = token.replace(/__BREAK_LINE__/g, "\n");
                    return this.isStringPattern(token) ? this.build(`(${token})`, arg) : token;
                })
            );
        } else {
            Log.error(`${CurrentLine()} binding function '${func.name}' does not exist!`);
            str = `'[Compile Error]: function >>${func.name}<< not found!'`;
        }

        return str;
    }

    static readFunctionFromToken(tokens: Array<string>, arg: UI | OverrideInterface) {
        const name = tokens[0];
        tokens = tokens.slice(2, tokens.length - 1);

        const params: Array<string> = [];
        let param = "",
            $ = 0;

        for (const token of tokens) {
            if (token === "," && !$) {
                params.push(param);
                param = "";
            } else if (token === "(") {
                $++;
                param += token;
            } else if (token === ")") {
                $--;
                param += token;
            } else param += token;
        }
        if (param !== "") params.push(param);

        return {
            name,
            params: params.map(token => {
                if (this.getTokens(this.splitString(token)).length > 1)
                    return this.build(this.isCodeBlock(token) ? token : `(${token})`, arg);
                else return token;
            }),
        };
    }

    static readTokens(strTokens: Array<string>) {
        const tokens: Array<string> = [];
        let strToken = "";
        let functionName: string | null = null,
            brackets = 0;

        for (const token of strTokens) {
            if (this.maybeFunctionName(token) && !brackets) {
                if (functionName) tokens.push(functionName);
                functionName = token;
            } else if (["(", ")"].includes(token)) {
                if (functionName) {
                    strToken += functionName;
                    functionName = null;
                }
                if (token === "(") brackets++;
                else brackets--;
                strToken += token;
                if (brackets === 0) {
                    tokens.push(strToken);
                    strToken = "";
                }
            } else {
                if (brackets) strToken += token;
                else if (functionName) {
                    tokens.push(functionName);
                    functionName = null;
                    tokens.push(token);
                } else tokens.push(token);
            }
        }

        if (functionName) tokens.push(functionName);
        return tokens;
    }

    static getTokens(strTokens: Array<string>) {
        const tokens: Array<string> = [];
        for (const token of strTokens) {
            if (this.isString(token)) tokens.push(token);
            else
                tokens.push(
                    ...(token.match(
                        /-?((\d+\.)?\d+)(e-?\d+)?|[#$]?\w+|[><=!]?=|(&&|\|\|)|[\[\]()+\-*\/=><!,&%|?:]/gm
                    ) ?? [])
                );
        }
        return tokens;
    }

    static buildNewBinding(token: string, arg: UI | OverrideInterface) {
        const rndName: `#${string}` = `#${Random.getName()}`;

        if (this.isHasBinding(token)) {
            if (this.isBindingOrVariable(token)) return token;

            arg.addBindings({
                source_property_name: [token],
                target_property_name: rndName,
            });
        } else {
            arg.setProperties({
                property_bag: {
                    [rndName]: this.compile(token, arg),
                },
            });
        }

        return rndName;
    }

    static findSourceBindings(token: string, sourceControlsName: string, lastResourceBindings?: any) {
        const reSourceBindings: Record<string, string> = lastResourceBindings || {};
        const newTokens: string[] = [];

        this.getTokens(this.splitString(token)).forEach(token => {
            if (this.isBindingOrVariable(token)) {
                newTokens.push(
                    reSourceBindings[`${token}:${sourceControlsName}`] ||= <string>Random.bindingName()
                );
            } else if (this.isString(token)) {
                newTokens.push(this.getStringTokens(token).map(token => {
                    if (this.isStringCode(token)) {
                        const sourceBindings = this.findSourceBindings(token.slice(1, token.length - 1), sourceControlsName, reSourceBindings);
                        for (const key in sourceBindings.reSourceBindings) reSourceBindings[key] = sourceBindings.reSourceBindings[key];
                        return `{${sourceBindings.newTokens.join("")}}`;
                    } else return token;
                }).join(""));
            } else newTokens.push(token);
        })

        return { reSourceBindings, newTokens };
    }

    static isCanCompile(token: string | string[]) {
        return Array.isArray(token) || (token.startsWith("[") && token.endsWith("]"));
    }

    static isString(token: string) {
        return /^'.+'$/.test(token) || token === "''";
    }

    static isStringCode(token: string) {
        return /^{.+}$/.test(token);
    }

    static isStringPattern(token: string) {
        return this.isString(token) && /\{.+\}/.test(token);
    }

    static isNegativeNumber(token: string) {
        return /^-((\d+\.)?\d+)$/.test(token);
    }

    static isScientificNotation(token: string) {
        return /^-?((\d+\.)?\d+)(e-?\d+)$/.test(token);
    }

    static isFunction(token: string) {
        return /^\w+\(.*\)$/.test(token);
    }

    static isArray(token: string) {
        return /^\[.*\]$/.test(token);
    }

    static isCodeBlock(token: string) {
        return /^\(.+\)$/.test(token);
    }

    static maybeFunctionName(token: string) {
        return /^\w+$/.test(token);
    }

    static isBindingOrVariable(token: string) {
        return /^[#$]\w+$/.test(token);
    }

    static isOperator(token: string) {
        return /^[+\-*\/%><=!&|]$|^[><=!]=$/.test(token);
    }

    static isHasBinding(token: string) {
        return /#\w+/.test(token);
    }

    static isNumber(value: string) {
        return /^(\d+|\d+\.\d+|-\d+|-\d+\.\d+)$/.test(value);
    }
}
