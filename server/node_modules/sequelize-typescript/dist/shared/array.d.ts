/**
 * Removes duplicates from specified array
 */
export declare function unique<T>(arr: T[]): T[];
/**
 * Returns true for items, that only exists once on an array
 */
export declare const uniqueFilter: <T>(item: T, index: number, arr: T[]) => boolean;
