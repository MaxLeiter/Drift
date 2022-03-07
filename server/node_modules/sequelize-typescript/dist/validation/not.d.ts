/**
 * Will not allow values, that match the string regex or real regex
 */
export declare function Not(arg: string | (string | RegExp)[] | RegExp | {
    msg: string;
    args: string | (string | RegExp)[] | RegExp;
}): Function;
