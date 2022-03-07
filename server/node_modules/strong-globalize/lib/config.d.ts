export declare type AnyObject<T = any> = {
    [name: string]: T;
};
export declare type ResourceTag = {
    fileIdHash: string;
    fileName: string;
    lang: string;
    tagType: string;
};
export interface GlobalizeConfig {
    AUTO_MSG_LOADING?: string;
    MASTER_ROOT_DIR?: string;
    MSG_RES_LOADED?: ResourceTag[];
    APP_LANGS?: string[];
    loadMessages?(messages: AnyObject): void;
    formatters?: Map<string, any>;
    locale?(lang?: string): void;
    DEFAULT_LANG?: string;
    bundles?: AnyObject;
    DISABLE_CONSOLE?: boolean;
    LOG_FN?: (level: string, message: any) => void;
    load?(obj: AnyObject): void;
    versionSG?: string;
    versionG?: string;
    getHash?(path: string): string;
    PSEUDO_LOC_PREAMBLE?: string;
    reset(): void;
    initialized?: boolean;
}
export declare const STRONGLOOP_GLB: GlobalizeConfig;
