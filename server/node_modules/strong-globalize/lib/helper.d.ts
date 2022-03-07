import { AnyObject } from './config';
export declare const ENGLISH = "en";
export declare const PSEUDO_LANG = "zz";
export declare const PSEUDO_TAG = "\u265A\u265B\u265C\u265D\u265E\u265F";
export declare const MSG_TAG = "message";
export declare const HELPTXT_TAG = "helptxt";
export declare const AML_ALL = "all";
export declare const AML_NONE = "none";
export declare const AML_DEFAULT = "none";
export declare const BIG_NUM = 999999999999;
export declare const MSG_GPB_UNAVAILABLE = "*** Login to GPB failed or GPB.supportedTranslations error.";
export declare function hashKeys(p: string): boolean;
/**
 * @param {string} Override the root directory path
 */
export declare function setRootDir(rootPath: string): void;
export declare function getRootDir(): string;
export declare function isRootPackage(): boolean;
export declare function initGlobForSltGlobalize(rootDir?: string): void;
export declare function isLoadMessages(rootDir: string): boolean;
export declare function validateAmlValue(aml: string | string[]): false | string[] | "all" | "none";
export declare function msgFileIdHash(fileName: string, rootDir: string): string;
export declare function registerResTag(fileIdHash: string, fileName: string, lang: string, tagType: string): boolean;
export declare function resTagExists(fileIdHash: string, fileName: string, lang: string, tagType: string): boolean;
export declare function stripBom(str: string): string;
export declare function enumerateFilesSync(rootDir: string, blackList: string[] | null, targetFileType: string | string[], verbose: boolean, checkNodeModules: boolean, callback: (content: string, filePath: string) => void): void;
export declare function alreadyScanned(fileName: string): boolean;
export declare function enumerateFilesSyncPriv(currentPath: string, rootDir: string, blackList: string[] | null, targetFileType: string | string[], verbose: boolean, checkNodeModules: boolean, callback: (content: string, child: string) => void): void;
/**
 * @param action A function to be invoked for each target language.
 * If it returns `true`, the enumeration will be terminated.
 */
export declare function enumerateLanguageSync(action: (lang: string) => boolean | undefined): void;
/**
 * @param {string} lang Supported languages in CLDR notation
 * @param {Function}
 *   If callback returns err; if err, stop enumeration.
 */
export declare function cloneEnglishTxtSyncDeep(rootDir?: string): number;
export declare function enumerateMsgSync(rootDir: string, lang: string, checkNodeModules: boolean, callback: (jsonObj: AnyObject, filePath: string) => void): number;
export declare function enumerateMsgSyncPriv(currentPath: string, rootDir: string, lang: string, checkNodeModules: boolean, cloneEnglishTxt: boolean, clonedTxtCount: number, callback: (json: object, file: string) => void): number;
export declare function removeObsoleteFile(dir: string, fileNames: string[]): void;
export declare function directoryDepth(fullPath: string): number;
export declare function maxDirectoryDepth(): number;
export declare function requireResolve(depName: string, currentDir: string, rootDir: string): string | null;
export declare function unsymbolLink(filePath: string): string | null;
export declare function resolveDependencies(currentDir: string, rootDir: string, moduleRootPaths?: string[]): string[] | null;
export declare function readToJson(langDirPath: string, msgFile: string, lang: string): any;
export declare function normalizeKeyArrays(keyArrays?: string | string[]): string[][];
export declare function scanJson(keys: string[], data: AnyObject, returnErrors?: boolean): string[] | AnyObject<any>;
export declare function replaceJson(keys: string[], data: AnyObject, newValues: any[]): string[] | AnyObject<any>;
export declare function scanJsonPriv(keys: string[], data: AnyObject, newValues: any[] | null, returnErrors?: boolean): string[] | AnyObject;
export declare function sortMsges(msgs: {
    [name: string]: any;
}): {
    [name: string]: any;
};
/**
 * Initialize intl directory structure for non-En languages
 * intl/en must exist.
 * it returns false if failed.
 */
export declare function initIntlDirs(): boolean;
/**
 * @param {string} lang Supported languages in CLDR notation
 * Returns true for 'en' and supported languages
 * in CLDR notation.
 */
export declare function isSupportedLanguage(lang?: string): boolean;
/**
 * Returns an array of locales supported by the local cldr data.
 */
export declare function getSupportedLanguages(): string[];
export declare function getAppLanguages(): string[];
/**
 * Returns trailer of file name.
 */
export declare function getTrailerAfterDot(name: string): string | null;
/**
 * Returns package name defined in package.json.
 */
export declare function getPackageName(root?: string): any;
export declare function getPackageVersion(root?: string): any;
export declare function getPackageItem(root: string | undefined, itemName: string): any;
/**
 * @param {string} name to be checked
 * @param {Array} headersAllowed a list of strings to check
 * Returns directory path for the language.
 */
export declare function headerIncluded(name: string, headersAllowed: string[]): boolean;
/**
 * @param {string} lang Supported languages in CLDR notation
 * Returns directory path for the language.
 */
export declare function intlDir(lang: string): string;
/**
 * %s is included in the string
 */
export declare function percent(msg: string): boolean;
/**
 * %replace %s with {N} where N=0,1,2,...
 */
export declare function mapPercent(msg: string): string;
export declare function mapArgs(p: string, args: any[]): string[];
export declare function repackArgs(args: any[] | {
    [name: number]: any;
}, initIx: number): any[];
/**
 * Get the language (from the supported languages) that
 * best matches the requested Accept-Language expression.
 *
 * @param req
 * @param globalize
 * @returns {*}
 */
export declare function getLanguageFromRequest(req: {
    headers: {
        [name: string]: string;
    };
}, appLanguages: string[], defaultLanguage: string): string;
export declare function myIntlDir(): string;
/**
 * Load messages for the language from a given root directory
 * @param lang Language for messages
 * @param rootDir Root directory
 * @param enumerateNodeModules A flag to control if node_modules will be checked
 */
export declare function loadMsgFromFile(lang: string, rootDir: string, enumerateNodeModules?: boolean): void;
/**
 * Remove `{{` and `}}`
 */
export declare function removeDoubleCurlyBraces(json: AnyObject): void;
/**
 * If an language has alias name that SG supports, return the alias name.
 *
 * The known aliases are hard-coded to solve issue
 * https://github.com/strongloop/strong-globalize/issues/150
 * @param lang
 */
export declare function getLangAlias(lang: string): string;
