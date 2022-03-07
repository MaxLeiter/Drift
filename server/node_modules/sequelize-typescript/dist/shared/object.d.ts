/**
 * Deep copies properties of all sources into target object.
 * The last source overrides all properties of the previous
 * ones, if they have the same names
 */
export declare function deepAssign<T, S1, S2, S3>(target: T, source1: S1, source2: S2, source3: S3): T & S1 & S2 & S3;
export declare function deepAssign<T, S1, S2>(target: T, source1: S1, source2: S2): T & S1 & S2;
export declare function deepAssign<T, S>(target: T, source: S): T & S;
export declare function deepAssign<S>(target: {}, source: S): S;
/**
 * I clone the given RegExp object, and ensure that the given flags exist on
 * the clone. The injectFlags parameter is purely additive - it cannot remove
 * flags that already exist on the
 *
 * @param input RegExp - I am the regular expression object being cloned.
 * @param injectFlags String( Optional ) - I am the flags to enforce on the clone.
 * @source https://www.bennadel.com/blog/2664-cloning-regexp-regular-expression-objects-in-javascript.htm
 */
export declare function cloneRegExp(input: RegExp, injectFlags?: string): RegExp;
export declare function getAllPropertyNames(obj: any): string[];
