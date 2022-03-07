import { AnyObject } from './config';
export { setRootDir } from './helper';
export declare const c: typeof formatCurrency;
export declare const d: typeof formatDate;
export declare const n: typeof formatNumber;
export declare const t: typeof formatMessage;
export declare const m: typeof formatMessage;
export { STRONGLOOP_GLB } from './config';
/**
 * setDefaultLanguage
 *
 * @param {string} (optional, default: `'en'`) Language ID.
 *     It tries to use OS language, then falls back to 'en'
 */
export declare function setDefaultLanguage(lang?: string): string | undefined;
/**
 * setAppLanguages
 *
 * @param {string} (optional, default: `[...]`) [].
 *    Sets the supported languages for the application.
 *    These should be a subset of the languages within the intl
 *    directory.
 *
 *    If no argument is passed, the function uses the contents of
 *    the intl directory to determine the application languages.
 *
 */
export declare function setAppLanguages(langs?: string[]): string[];
/**
 * Globalize.formatMessage wrapper returns a string.
 *
 * @param {string} path The message key
 * @param {object} variables List of placeholder key and content value pair.
 * @param {string} variables.<phXXX> The placeholder key.
 * @param {string} variables.<string> The content value.
 *     If the system locale is undefined, falls back to 'en'
 */
export declare function formatMessage(path: string, variables?: string[] | string, lang?: string): any;
export declare function formatJson(fullPath: string, variables: string[], lang?: string): any;
export declare function packMessage(args: any[], fn: null | ((msg: any) => any), withOriginalMsg: boolean, lang?: string): any;
export declare function rfc5424(level: string, args: any[], print: (...args: any[]) => void, lang?: string): any;
export declare function emergency(...args: any[]): any;
export declare function alert(...args: any[]): any;
export declare function critical(...args: any[]): any;
export declare function error(...args: any[]): any;
export declare function warning(...args: any[]): any;
export declare function notice(...args: any[]): any;
export declare function informational(...args: any[]): any;
export declare function debug(...args: any[]): any;
export declare function warn(...args: any[]): any;
export declare function info(...args: any[]): any;
export declare function log(...args: any[]): any;
export declare function help(...args: any[]): any;
export declare function data(...args: any[]): any;
export declare function prompt(...args: any[]): any;
export declare function verbose(...args: any[]): any;
export declare function input(...args: any[]): any;
export declare function silly(...args: any[]): any;
/**
 * Globalize.formatNumber wrapper returns a string.
 *
 * @param {value} integer or float
 * @param {object} The options (optional); if null, use the StrongLoop default.
 *     Strongly recommended to set NO options and let strong-globalize use
 *     the StrongLoop default for consistency across StrongLoop products.
 *     See https://www.npmjs.com/package/globalize#number-module
 */
export declare function formatNumber(value: number, options?: AnyObject, lang?: string): any;
/**
 * Globalize.formatDate wrapper returns a string.
 *
 * @param {Date object} such as new Date()
 * @param {object} The options (optional); if null, use the StrongLoop default.
 *     Strongly recommended to set NO options and let strong-globalize use
 *     the StrongLoop default for consistency across StrongLoop products.
 *     See https://www.npmjs.com/package/globalize#date-module
 */
export declare function formatDate(value: Date, options?: AnyObject, lang?: string): any;
/**
 * Globalize.formatCurrency wrapper returns a string.
 *
 * @param {value} integer or float
 * @param {string} three-letter currency symbol, ISO 4217 Currency Code
 * @param {object} The options (optional); if null, use the StrongLoop default.
 *     Strongly recommended to set NO options and let strong-globalize use
 *     the StrongLoop default for consistency across StrongLoop products.
 *     See https://www.npmjs.com/package/globalize#curency-module
 */
export declare function formatCurrency(value: any, currencySymbol: string, options?: AnyObject, lang?: string): any;
export declare function loadGlobalize(lang?: string, enumerateNodeModules?: boolean): any;
/**
 *
 * Persistent logging
 *
 */
export declare function consoleEnabled(): boolean;
/**
 *
 */
export declare function setPersistentLogging(logFn: (level: string, message: {
    [name: string]: any;
}) => void, disableConsole?: boolean): void;
export declare function logPersistent(level: string | undefined, message: any): void;
