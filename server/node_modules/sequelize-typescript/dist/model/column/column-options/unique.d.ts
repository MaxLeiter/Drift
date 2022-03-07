declare type UniqueOptions = boolean | string | {
    name: string;
    msg: string;
};
/**
 * Sets unique option as specified in options and returns decorator
 */
export declare function Unique(options: UniqueOptions): Function;
/**
 * Decorator, which sets unique option true for annotated property.
 */
export declare function Unique(target: Object, propertyName: string): void;
export {};
