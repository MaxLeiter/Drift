// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// Node module: strong-globalize
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

// tslint:disable:no-any

export type AnyObject<T = any> = {
  [name: string]: T;
};

export type ResourceTag = {
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

export const STRONGLOOP_GLB: GlobalizeConfig = {
  reset() {
    // tslint:disable:no-invalid-this
    const keys = Object.keys(this).filter((k) => k !== 'reset');
    keys.forEach((k) => {
      // Clean up all properties except `reset`
      delete this[k];
    });
  },
};
