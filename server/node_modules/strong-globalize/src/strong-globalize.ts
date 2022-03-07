// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// Node module: strong-globalize
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

// Multi-instance strong-globalize
import * as globalize from './globalize';
import * as helper from './helper';
import * as path from 'path';

import {AnyObject, STRONGLOOP_GLB} from './config';
import {getLangAlias} from './helper';

// tslint:disable:no-any

/**
 * FIXME: workaround for
 * https://github.com/strongloop/strong-globalize/issues/127
 *
 * Monkey-patching Cldr.prototype.get for `zz`
 * See:
 * https://github.com/rxaviers/cldrjs/blob/master/src/core/likely_subtags.js#L75
 */
try {
  const Cldr = require('cldrjs');
  const get = Cldr.prototype.get;
  Cldr.prototype.get = function (paths?: string[]) {
    if (Array.isArray(paths)) {
      paths = paths.map(function (p) {
        return p === 'zz' ? 'en' : p;
      });
    }
    // tslint:disable-next-line:no-invalid-this
    return get.call(this, paths);
  };
} catch (e) {
  // Ignore
}

export class StrongGlobalize {
  static readonly helper = helper;
  static readonly globalize = globalize;
  static readonly STRONGLOOP_GLB: AnyObject = STRONGLOOP_GLB;

  private _options: AnyObject;

  constructor(options?: AnyObject) {
    if (typeof options === 'string') {
      StrongGlobalize.SetRootDir(options);
      options = undefined;
    }
    if (!STRONGLOOP_GLB.DEFAULT_LANG) {
      globalize.setDefaultLanguage();
      globalize.setAppLanguages();
    }

    const defaults = {
      language: STRONGLOOP_GLB.DEFAULT_LANG,
      appLanguages: STRONGLOOP_GLB.APP_LANGS,
    };

    this._options = options ? Object.assign(defaults, options) : defaults;
  }

  static SetPersistentLogging = globalize.setPersistentLogging;
  static SetDefaultLanguage = globalize.setDefaultLanguage;
  static SetAppLanguages = globalize.setAppLanguages;

  static SetRootDir(rootDir: string, options?: AnyObject) {
    const defaults = {
      autonomousMsgLoading: helper.AML_DEFAULT,
    };
    options = options ? Object.assign(defaults, options) : defaults;
    options.autonomousMsgLoading = helper.validateAmlValue(
      options.autonomousMsgLoading
    );
    if (!options.autonomousMsgLoading) {
      options.autonomousMsgLoading = defaults.autonomousMsgLoading;
    }
    globalize.setRootDir(rootDir);
    if (!STRONGLOOP_GLB.AUTO_MSG_LOADING) {
      globalize.setDefaultLanguage();
      STRONGLOOP_GLB.AUTO_MSG_LOADING = options.autonomousMsgLoading as string;
    }
    if (
      path.resolve(rootDir) !== path.resolve(STRONGLOOP_GLB.MASTER_ROOT_DIR!) &&
      helper.isLoadMessages(rootDir)
    ) {
      const langs = Object.keys(STRONGLOOP_GLB.bundles!);
      langs.forEach(function (lang) {
        helper.loadMsgFromFile(lang, rootDir);
      });
    }
  }

  setLanguage(lang?: string) {
    if (lang) lang = getLangAlias(lang);
    lang = helper.isSupportedLanguage(lang)
      ? lang
      : STRONGLOOP_GLB.DEFAULT_LANG;
    this._options.language = lang;
  }

  getLanguage() {
    return this._options.language;
  }

  c(value: any, currencySymbol: string, options?: AnyObject) {
    globalize.loadGlobalize(this._options.language);
    return globalize.formatCurrency(
      value,
      currencySymbol,
      options,
      this._options.language
    );
  }

  formatCurrency(value: any, currencySymbol: string, options?: AnyObject) {
    return this.c(value, currencySymbol, options);
  }

  d(value: Date, options?: AnyObject) {
    globalize.loadGlobalize(this._options.language);
    return globalize.formatDate(value, options, this._options.language);
  }

  formatDate(value: Date, options?: AnyObject) {
    return this.d(value, options);
  }

  n(value: number, options?: AnyObject) {
    globalize.loadGlobalize(this._options.language);
    return globalize.formatNumber(value, options, this._options.language);
  }

  formatNumber(value: number, options?: AnyObject) {
    return this.n(value, options);
  }

  m(msgPath: string, variables: string | string[]) {
    globalize.loadGlobalize(this._options.language);
    return globalize.formatMessage(msgPath, variables, this._options.language);
  }

  formatMessage(msgPath: string, variables: string | string[]) {
    return this.m(msgPath, variables);
  }

  t(msgPath: string, variables: string | string[]) {
    return this.m(msgPath, variables);
  }

  Error(...args: any[]) {
    globalize.loadGlobalize(this._options.language);
    const msg = globalize.packMessage(args, null, true, this._options.language);
    globalize.logPersistent('error', msg);
    return Error(msg.message);
  }

  f(...args: any[]) {
    globalize.loadGlobalize(this._options.language);
    return globalize.packMessage(args, null, false, this._options.language);
  }

  format(...args: any[]) {
    return this.f(...args);
  }

  ewrite(...args: any[]) {
    globalize.loadGlobalize(this._options.language);
    return globalize.packMessage(
      args,
      function (msg) {
        globalize.logPersistent(msg, 'error');
        if (globalize.consoleEnabled()) process.stderr.write(msg.message);
        return msg;
      },
      true,
      this._options.language
    );
  }

  owrite(...args: any[]) {
    globalize.loadGlobalize(this._options.language);
    return globalize.packMessage(
      args,
      function (msg) {
        globalize.logPersistent(msg, 'error');
        if (globalize.consoleEnabled()) process.stdout.write(msg.message);
      },
      true,
      this._options.language
    );
  }

  write(...args: any[]) {
    this.owrite(...args);
  }

  // RFC 5424 Syslog Message Severities
  emergency(...args: any[]) {
    globalize.loadGlobalize(this._options.language);
    return globalize.rfc5424(
      'emergency',
      args,
      console.error,
      this._options.language
    );
  }
  alert(...args: any[]) {
    globalize.loadGlobalize(this._options.language);
    return globalize.rfc5424(
      'alert',
      args,
      console.error,
      this._options.language
    );
  }
  critical(...args: any[]) {
    globalize.loadGlobalize(this._options.language);
    return globalize.rfc5424(
      'critical',
      args,
      console.error,
      this._options.language
    );
  }
  error(...args: any[]) {
    globalize.loadGlobalize(this._options.language);
    return globalize.rfc5424(
      'error',
      args,
      console.error,
      this._options.language
    );
  }
  warning(...args: any[]) {
    globalize.loadGlobalize(this._options.language);
    return globalize.rfc5424(
      'warning',
      args,
      console.error,
      this._options.language
    );
  }
  notice(...args: any[]) {
    globalize.loadGlobalize(this._options.language);
    return globalize.rfc5424(
      'notice',
      args,
      console.log,
      this._options.language
    );
  }
  informational(...args: any[]) {
    globalize.loadGlobalize(this._options.language);
    return globalize.rfc5424(
      'informational',
      args,
      console.log,
      this._options.language
    );
  }
  debug(...args: any[]) {
    globalize.loadGlobalize(this._options.language);
    return globalize.rfc5424(
      'debug',
      args,
      console.log,
      this._options.language
    );
  }

  // Node.js console
  warn(...args: any[]) {
    globalize.loadGlobalize(this._options.language);
    return globalize.rfc5424(
      'warn',
      args,
      console.error,
      this._options.language
    );
  }
  info(...args: any[]) {
    globalize.loadGlobalize(this._options.language);
    return globalize.rfc5424('info', args, console.log, this._options.language);
  }
  log(...args: any[]) {
    globalize.loadGlobalize(this._options.language);
    return globalize.rfc5424('log', args, console.log, this._options.language);
  }

  // Misc Logging Levels
  help(...args: any[]) {
    globalize.loadGlobalize(this._options.language);
    return globalize.rfc5424('help', args, console.log, this._options.language);
  }
  data(...args: any[]) {
    globalize.loadGlobalize(this._options.language);
    return globalize.rfc5424('data', args, console.log, this._options.language);
  }
  prompt(...args: any[]) {
    globalize.loadGlobalize(this._options.language);
    return globalize.rfc5424(
      'prompt',
      args,
      console.log,
      this._options.language
    );
  }
  verbose(...args: any[]) {
    globalize.loadGlobalize(this._options.language);
    return globalize.rfc5424(
      'verbose',
      args,
      console.log,
      this._options.language
    );
  }
  input(...args: any[]) {
    globalize.loadGlobalize(this._options.language);
    return globalize.rfc5424(
      'input',
      args,
      console.log,
      this._options.language
    );
  }
  silly(...args: any[]) {
    globalize.loadGlobalize(this._options.language);
    return globalize.rfc5424(
      'silly',
      args,
      console.log,
      this._options.language
    );
  }

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
  static readonly sgCache = new Map<
    string,
    StrongGlobalize
  >(); /* eslint-env es6 */
  http(req: {headers: AnyObject}) {
    const matchingLang = helper.getLanguageFromRequest(
      req,
      this._options.appLanguages,
      this._options.language
    );

    let sg = StrongGlobalize.sgCache.get(matchingLang);
    if (sg) {
      return sg;
    }

    sg = new StrongGlobalize(this._options);
    sg.setLanguage(matchingLang);
    StrongGlobalize.sgCache.set(matchingLang, sg);
    return sg;
  }
}
