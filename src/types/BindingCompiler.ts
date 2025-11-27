export enum TokenKind {
    BINDING, // #abc
    VARIABLE, // $abc
    NUMBER, // -123
    STRING, // 'abc'
    FORMAT_STRING, // 'abc{1+2}'
    WORD, // abc
    NOT, // !

    COMMA, // ,
    DOT, // .
    OPERATOR, // + - * / > >= < <= == != &&

    OPEN_PARENTHESIS, // (
    CLOSE_PARENTHESIS, // )
}

export interface Token {
    kind: TokenKind;
    priority: number;
    position: number;
    value: string;
}

export type Tokens = (Token | Tokens)[];
