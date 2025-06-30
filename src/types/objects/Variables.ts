export interface VariablesInterface {
    [key: `$${string}` | `(${string})`]: {
        [key: `$${string}`]: any;
    };
}
