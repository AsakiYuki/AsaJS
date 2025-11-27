import { UI } from "../components/UI";
import { Token, TokenKind, Tokens } from "../types/BindingCompiler";
import { OverrideInterface } from "../types/objects/Modify";

export class BindingCompiler {
    static compile(propertyName: `[${string}]` | string[], arg: UI | OverrideInterface) {
        const input = Array.isArray(propertyName)
            ? propertyName[0]
            : propertyName.slice(1, propertyName.length - 1);
        const output = new BindingCompiler(input).compile();
    }

    static isCanCompile(token: string | string[]) {
        return Array.isArray(token) || (token.startsWith("[") && token.endsWith("]"));
    }

    static makeToken(input: string, start: number, length: number): string {
        return input.slice(start, start + length);
    }

    static isBlankSpace(input: string) {
        return /\s/.test(input);
    }

    static isWordCharacter(input: string) {
        return /\w/.test(input);
    }

    static isNumberCharacter(input: string) {
        return /\d/.test(input);
    }

    static lexer(input: string) {
        const tokens: Token[] = [];

        let i = 0;
        while (++i < input.length) {
            if (this.isBlankSpace(input[i])) continue;

            switch (input[i]) {
                // BINDING
                case "#":
                    {
                        let length = 1;
                        while (++i < input.length) {
                            if (this.isWordCharacter(input[i])) length++;
                            else break;
                        }
                        tokens.push({
                            priority: 0,
                            kind: TokenKind.BINDING,
                            position: i - length,
                            value: BindingCompiler.makeToken(input, i - length, length),
                        });
                        i--;
                    }
                    break;

                // VARIABLE
                case "$":
                    {
                        let length = 1;
                        while (++i < input.length) {
                            if (this.isWordCharacter(input[i])) length++;
                            else break;
                        }
                        tokens.push({
                            priority: 0,
                            kind: TokenKind.VARIABLE,
                            position: i - length,
                            value: BindingCompiler.makeToken(input, i - length, length),
                        });
                        i--;
                    }
                    break;

                // OPERATOR
                case "+":
                    tokens.push({
                        priority: 1,
                        kind: TokenKind.OPERATOR,
                        position: i,
                        value: input[i],
                    });
                    break;

                case "-":
                    tokens.push({
                        priority: 1,
                        kind: TokenKind.OPERATOR,
                        position: i,
                        value: input[i],
                    });
                    break;

                case "*":
                    tokens.push({
                        priority: 2,
                        kind: TokenKind.OPERATOR,
                        position: i,
                        value: input[i],
                    });
                    break;

                case "/":
                    tokens.push({
                        priority: 2,
                        kind: TokenKind.OPERATOR,
                        position: i,
                        value: input[i],
                    });
                    break;

                case "(":
                    tokens.push({
                        priority: 0,
                        kind: TokenKind.OPEN_PARENTHESIS,
                        position: i,
                        value: input[i],
                    });
                    break;

                case ")":
                    tokens.push({
                        priority: 0,
                        kind: TokenKind.CLOSE_PARENTHESIS,
                        position: i,
                        value: input[i],
                    });
                    break;

                case ",":
                    tokens.push({
                        priority: 0,
                        kind: TokenKind.COMMA,
                        position: i,
                        value: input[i],
                    });
                    break;

                case ".":
                    tokens.push({
                        priority: 0,
                        kind: TokenKind.DOT,
                        position: i,
                        value: input[i],
                    });
                    break;

                case "'":
                    {
                        // 0 is code block in string, 1 is string in code block
                        const handler: (0 | 1)[] = [];
                        let length = 1,
                            isFormated = false;

                        while (++i < input.length) {
                            const inputChar = input[i],
                                lastHandler = handler[handler.length - 1];

                            if (inputChar === "{") {
                                if (lastHandler === 0 || lastHandler === undefined) {
                                    handler.push(1);
                                    isFormated = true;
                                } else throw new Error("not implemented");
                            } else if (inputChar === "}") {
                                if (lastHandler === 1) handler.pop();
                                else throw new Error("not implemented");
                            } else if (inputChar === "'") {
                                if (handler.length === 0) {
                                    tokens.push({
                                        priority: 0,
                                        kind: isFormated
                                            ? TokenKind.FORMAT_STRING
                                            : TokenKind.STRING,
                                        position: i - length,
                                        value: BindingCompiler.makeToken(
                                            input,
                                            i - length,
                                            length + 1
                                        ),
                                    });
                                    break;
                                } else if (lastHandler === 0) handler.pop();
                                else handler.push(0);
                            }

                            length++;
                        }
                    }
                    break;

                case "=":
                    if (input[i + 1] === "=")
                        tokens.push({
                            priority: 1,
                            kind: TokenKind.OPERATOR,
                            position: i++,
                            value: BindingCompiler.makeToken(input, i - 1, 2),
                        });
                    else throw new Error("not implemented");
                    break;

                case "&":
                    if (input[i + 1] === "&")
                        tokens.push({
                            priority: 1,
                            kind: TokenKind.OPERATOR,
                            position: i++,
                            value: BindingCompiler.makeToken(input, i - 1, 2),
                        });
                    else throw new Error("not implemented");
                    break;

                case "!":
                    if (input[i + 1] === "=") {
                        tokens.push({
                            priority: 1,
                            kind: TokenKind.OPERATOR,
                            position: i++,
                            value: BindingCompiler.makeToken(input, i - 1, 2),
                        });
                    } else {
                        tokens.push({
                            priority: 1,
                            kind: TokenKind.NOT,
                            position: i,
                            value: input[i],
                        });
                    }
                    break;

                case "<":
                    if (input[i + 1] === "=") {
                        tokens.push({
                            priority: 1,
                            kind: TokenKind.OPERATOR,
                            position: i++,
                            value: BindingCompiler.makeToken(input, i - 1, 2),
                        });
                    } else {
                        tokens.push({
                            priority: 1,
                            kind: TokenKind.OPERATOR,
                            position: i,
                            value: input[i],
                        });
                    }
                    break;

                case ">":
                    if (input[i + 1] === "=") {
                        tokens.push({
                            priority: 1,
                            kind: TokenKind.OPERATOR,
                            position: i++,
                            value: BindingCompiler.makeToken(input, i - 1, 2),
                        });
                    } else {
                        tokens.push({
                            priority: 1,
                            kind: TokenKind.OPERATOR,
                            position: i,
                            value: input[i],
                        });
                    }
                    break;

                default:
                    {
                        if (BindingCompiler.isNumberCharacter(input[i])) {
                            let length = 1;

                            let hasExponent = false,
                                hasDot = false;

                            while (++i < input.length) {
                                if (BindingCompiler.isNumberCharacter(input[i])) length++;
                                else if (input[i] === ".") {
                                    if (hasDot || !BindingCompiler.isNumberCharacter(input[i + 1]))
                                        throw new Error("not implemented");
                                    hasDot = true;
                                    length++;
                                } else if (input[i] === "e" || input[i] === "E") {
                                    if (hasExponent) throw new Error("not implemented");
                                    hasExponent = true;

                                    if (input[i + 1] === "-") {
                                        length++;
                                        i++;
                                    }
                                    if (BindingCompiler.isBlankSpace(input[i + 1]))
                                        throw new Error("not implemented");

                                    length++;
                                } else break;
                            }

                            // convert to negative number
                            if (
                                (!tokens[tokens.length - 2] ||
                                    tokens[tokens.length - 2]?.kind === TokenKind.OPERATOR) &&
                                input[i - length - 1] === "-"
                            ) {
                                length++;
                                tokens.pop();
                            }

                            tokens.push({
                                priority: 0,
                                kind: TokenKind.NUMBER,
                                position: i - length,
                                value: BindingCompiler.makeToken(input, i - length, length),
                            });
                            i--;
                        } else if (this.isWordCharacter(input[i])) {
                            let length = 1;
                            while (++i < input.length) {
                                if (this.isWordCharacter(input[i])) length++;
                                else break;
                            }
                            tokens.push({
                                priority: 0,
                                kind: TokenKind.WORD,
                                position: i - length,
                                value: BindingCompiler.makeToken(input, i - length, length),
                            });
                            i--;
                        } else throw new Error("not implemented");
                    }
                    break;
            }
        }

        return tokens;
    }

    private tokens: Token[] = [];
    private index = 0;

    constructor(private input: string) {
        this.tokens = BindingCompiler.lexer(this.input);
    }

    static nextRequiredTokenType(token?: Token): (TokenKind | undefined)[] {
        if (
            [TokenKind.BINDING, TokenKind.VARIABLE, TokenKind.NUMBER, TokenKind.STRING].includes(
                token?.kind!
            )
        ) {
            return [TokenKind.OPERATOR, TokenKind.CLOSE_PARENTHESIS];
        } else if (token?.kind === TokenKind.OPERATOR) {
            return [
                TokenKind.BINDING,
                TokenKind.VARIABLE,
                TokenKind.NUMBER,
                TokenKind.STRING,
                TokenKind.CLOSE_PARENTHESIS,
                TokenKind.OPEN_PARENTHESIS,
                TokenKind.NOT,
            ];
        } else if (token?.kind === TokenKind.CLOSE_PARENTHESIS) {
            return [TokenKind.OPERATOR, TokenKind.CLOSE_PARENTHESIS, undefined];
        } else if (token?.kind === TokenKind.NOT) {
            return [TokenKind.BINDING, TokenKind.VARIABLE, TokenKind.OPEN_PARENTHESIS];
        } else {
            return [TokenKind.BINDING, TokenKind.VARIABLE, TokenKind.NUMBER, TokenKind.NOT];
        }
    }

    static parser(inputTokens: Token[]) {
        const tokens: Tokens = [];
        let index = -1,
            previousToken: Token | undefined = undefined;

        while (++index < inputTokens.length) {
            const currentToken = inputTokens[index];
            const nextRequire = this.nextRequiredTokenType(previousToken);

            if (currentToken.kind === TokenKind.OPEN_PARENTHESIS) {
                const subTokens: Token[] = [];
                let i = index,
                    openParenthesisCount = 1;

                while (++i < inputTokens.length) {
                    const token = inputTokens[i];

                    if (token.kind === TokenKind.OPEN_PARENTHESIS) openParenthesisCount++;
                    else if (token.kind === TokenKind.CLOSE_PARENTHESIS) openParenthesisCount--;

                    if (openParenthesisCount === 0) {
                        index = i;
                        break;
                    }

                    subTokens.push(token);
                }

                if (subTokens.length === 0) throw new Error("not implemented");

                previousToken = inputTokens[index];
                tokens.push(BindingCompiler.parser(subTokens));
                continue;
            } else if (nextRequire.includes(currentToken.kind)) {
                tokens.push(currentToken);
                previousToken = currentToken;
                continue;
            }

            throw new Error("not implemented");
        }

        if (previousToken?.kind === TokenKind.OPERATOR) throw new Error("not implemented");

        return tokens;
    }

    static operatorParser(tokens: Tokens) {
        let previousPriority = 0;
    }

    compile() {
        const parsedTokens = BindingCompiler.parser(this.tokens);

        console.log(parsedTokens);

        // BindingCompiler.operatorParser(parsedTokens);

        return;
    }
}
