import * as globalize from './globalize';
import * as helper from './helper';
import { AnyObject } from './config';
export declare class StrongGlobalize {
    static readonly helper: typeof helper;
    static readonly globalize: typeof globalize;
    static readonly STRONGLOOP_GLB: AnyObject;
    private _options;
    constructor(options?: AnyObject);
    static SetPersistentLogging: typeof globalize.setPersistentLogging;
    static SetDefaultLanguage: typeof globalize.setDefaultLanguage;
    static SetAppLanguages: typeof globalize.setAppLanguages;
    static SetRootDir(rootDir: string, options?: AnyObject): void;
    setLanguage(lang?: string): void;
    getLanguage(): any;
    c(value: any, currencySymbol: string, options?: AnyObject): any;
    formatCurrency(value: any, currencySymbol: string, options?: AnyObject): any;
    d(value: Date, options?: AnyObject): any;
    formatDate(value: Date, options?: AnyObject): any;
    n(value: number, options?: AnyObject): any;
    formatNumber(value: number, options?: AnyObject): any;
    m(msgPath: string, variables: string | string[]): any;
    formatMessage(msgPath: string, variables: string | string[]): any;
    t(msgPath: string, variables: string | string[]): any;
    Error(...args: any[]): Error;
    f(...args: any[]): any;
    format(...args: any[]): any;
    ewrite(...args: any[]): any;
    owrite(...args: any[]): any;
    write(...args: any[]): void;
    emergency(...args: any[]): any;
    alert(...args: any[]): any;
    critical(...args: any[]): any;
    error(...args: any[]): any;
    warning(...args: any[]): any;
    notice(...args: any[]): any;
    informational(...args: any[]): any;
    debug(...args: any[]): any;
    warn(...args: any[]): any;
    info(...args: any[]): any;
    log(...args: any[]): any;
    help(...args: any[]): any;
    data(...args: any[]): any;
    prompt(...args: any[]): any;
    verbose(...args: any[]): any;
    input(...args: any[]): any;
    silly(...args: any[]): any;
    /**
     * This function is useful for applications (e.g. express)
     * that have an HTTP Request object with headers.
     *
     * You can pass the request object, and it will negotiate
     * the best matching language to globalize the message.
     *
     * The matching algorithm is done against the languages
     * supported by the application. (those included in the intl dir)
     *
     * @param req
     * @returns {*}
     */
    static readonly sgCache: Map<string, StrongGlobalize>;
    http(req: {
        headers: AnyObject;
    }): StrongGlobalize;
}
