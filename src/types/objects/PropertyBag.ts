export interface BindingPropertyBag {
    [key: `#${string}`]: string | number | boolean;
}

export interface PropertyBag {
    [key: string]: string | number | boolean;
}
