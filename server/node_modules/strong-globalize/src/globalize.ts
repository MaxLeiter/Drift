// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// Node module: strong-globalize
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

//tslint:disable:no-any

import * as assert from 'assert';
import * as debugModule from 'debug';
import * as fs from 'fs';
import * as Globalize from 'globalize';
import {parse} from 'yamljs';
import {AnyObject, STRONGLOOP_GLB} from './config';
import * as helper from './helper';
import {getLangAlias} from './helper';
const dbg = debugModule('strong-globalize');
const osLocale = require('os-locale');
const MapCache = require('lodash/_MapCache');
const md5 = require('md5');
const memoize = require('lodash/memoize');
const pathUtil = require('path');
const util = require('util');

export {setRootDir} from './helper';

export const c = formatCurrency;
export const d = formatDate;
export const n = formatNumber;
export const t = formatMessage;
export const m = formatMessage;

export {STRONGLOOP_GLB} from './config';

/**
 * StrongLoop Defaults
 */

const SL_DEFAULT_DATETIME = {datetime: 'medium'};
const SL_DEFAULT_NUMBER = {round: 'floor'};
const SL_DEFAULT_CURRENCY = {style: 'name'};

const OS_LANG = osLanguage();
let MY_APP_LANG: string | null | undefined =
  process.env.STRONGLOOP_GLOBALIZE_APP_LANGUAGE;
MY_APP_LANG = helper.isSupportedLanguage(MY_APP_LANG!) ? MY_APP_LANG : null;

function osLanguage() {
  const locale = osLocale.sync();
  const lang = locale.substring(0, 2);
  if (helper.isSupportedLanguage(lang)) return lang;
  if (lang === 'zh') {
    const region = locale.substring(3);
    if (region === 'CN') return 'zh-Hans';
    if (region === 'TW') return 'zh-Hant';
    if (region === 'Hans') return 'zh-Hans';
    if (region === 'Hant') return 'zh-Hant';
  }
}

/**
 * setDefaultLanguage
 *
 * @param {string} (optional, default: `'en'`) Language ID.
 *     It tries to use OS language, then falls back to 'en'
 */
export function setDefaultLanguage(lang?: string) {
  if (lang) lang = getLangAlias(lang);
  lang = helper.isSupportedLanguage(lang) ? lang : undefined;
  lang = lang || MY_APP_LANG || OS_LANG || helper.ENGLISH;
  loadGlobalize(lang);
  if (lang !== helper.ENGLISH) {
    loadGlobalize(helper.ENGLISH);
  }
  STRONGLOOP_GLB.locale!(lang);
  STRONGLOOP_GLB.DEFAULT_LANG = lang;

  return lang;
}

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
export function setAppLanguages(langs?: string[]) {
  langs = langs || readAppLanguagesSync() || [];
  STRONGLOOP_GLB.APP_LANGS = langs;
  return langs;
}

function readAppLanguagesSync() {
  try {
    const langs = fs.readdirSync(
      pathUtil.join(STRONGLOOP_GLB.MASTER_ROOT_DIR, 'intl')
    );
    return langs;
  } catch (ex) {
    return null;
  }
}

/**
 * Globalize.formatMessage wrapper returns a string.
 *
 * @param {string} path The message key
 * @param {object} variables List of placeholder key and content value pair.
 * @param {string} variables.<phXXX> The placeholder key.
 * @param {string} variables.<string> The content value.
 *     If the system locale is undefined, falls back to 'en'
 */
export function formatMessage(
  path: string,
  variables?: string[] | string,
  lang?: string
) {
  assert(path);
  if (!STRONGLOOP_GLB.DEFAULT_LANG) setDefaultLanguage();
  let message = path;
  if (helper.hashKeys(path)) {
    if (!STRONGLOOP_GLB.getHash) {
      STRONGLOOP_GLB.getHash = memoize(md5);
    }
    path = STRONGLOOP_GLB.getHash!(path);
  }
  lang = lang || STRONGLOOP_GLB.DEFAULT_LANG;
  dbg('~~~ lang = %s %s %j %s', lang, path, variables, __filename);
  const trailer = helper.getTrailerAfterDot(path);
  if (trailer === 'json' || trailer === 'yml' || trailer === 'yaml') {
    const fullPath = pathUtil.join(helper.getRootDir(), path);
    return formatJson(fullPath, JSON.parse(variables as string), lang);
  }

  function formatMsgInline(language: string) {
    const g = STRONGLOOP_GLB.bundles![language];
    if (!STRONGLOOP_GLB.formatters) {
      STRONGLOOP_GLB.formatters = new MapCache();
    }
    const allFormatters = STRONGLOOP_GLB.formatters!;
    let langFormatters;
    if (allFormatters.has(language)) {
      langFormatters = allFormatters.get(language);
    } else {
      langFormatters = new MapCache();
      allFormatters.set(language, langFormatters);
    }
    if (langFormatters.has(path))
      return langFormatters.get(path)(variables || {});
    const format = g.messageFormatter(path);
    langFormatters.set(path, format);
    return format(variables || {});
  }
  try {
    message = formatMsgInline(lang!);
  } catch (e) {
    if (lang === helper.ENGLISH) {
      message = sanitizeMsg(message, variables);
      dbg(
        '*** %s not found for %s. Fall back to: "%s" ***  %s',
        path,
        lang,
        message,
        e
      );
    } else {
      dbg(
        '*** %s for %s not localized. Fall back to English. ***  %s',
        path,
        lang,
        e
      );
      try {
        message = formatMsgInline(helper.ENGLISH);
      } catch (e) {
        message = sanitizeMsg(message, variables);
        dbg(
          '*** %s not found for %s. Fall back to: "%s" ***  %s',
          path,
          lang,
          message,
          e
        );
      }
    }
  }
  if (STRONGLOOP_GLB.PSEUDO_LOC_PREAMBLE) {
    message = STRONGLOOP_GLB.PSEUDO_LOC_PREAMBLE + message;
  }
  return message;
}

export function formatJson(
  fullPath: string,
  variables: string[],
  lang?: string
) {
  assert(
    fullPath === pathUtil.resolve(helper.getRootDir(), fullPath),
    '*** full path is required to format json/yaml file: ' + fullPath
  );
  const fileType = helper.getTrailerAfterDot(fullPath);
  let jsonData = null;
  try {
    const contentStr = fs.readFileSync(fullPath, 'utf8');
    if (fileType === 'json') jsonData = JSON.parse(contentStr);
    if (fileType === 'yml' || fileType === 'yaml') jsonData = parse(contentStr);
  } catch (_e) {
    return '*** read failure: ' + fullPath;
  }
  const msgs = helper.scanJson(variables, jsonData) as string[];
  const transMsgs: string[] = [];
  msgs.forEach(function (msg) {
    const transMsg = formatMessage(msg, undefined, lang);
    transMsgs.push(transMsg);
  });
  helper.replaceJson(variables, jsonData, transMsgs);
  return jsonData;
}

function sanitizeMsg(message: string, variables?: string | string[]) {
  message = message.replace(/}}/g, '').replace(/{{/g, '');
  if (
    typeof variables === 'string' ||
    (Array.isArray(variables) && variables.length > 0)
  ) {
    const sanitizedMsg = message.replace(/%[sdj]/g, '%s');
    message = util.format.apply(util, [sanitizedMsg].concat(variables));
  }
  return message;
}

export function packMessage(
  args: any[],
  fn: null | ((msg: any) => any),
  withOriginalMsg: boolean,
  lang?: string
) {
  const path = args[0];
  const percentInKey = helper.percent(path);
  const txtWithTwoOrMoreArgs =
    helper.getTrailerAfterDot(path) === 'txt' && args.length > 2;
  // If it comes from *.txt, there are no percent in the path,
  // but there can be one or more %s in the message value.
  const variables = percentInKey
    ? helper.mapArgs(path, args)
    : txtWithTwoOrMoreArgs
    ? helper.repackArgs(args, 1)
    : args[1];
  let message = formatMessage(path, variables, lang);
  if (withOriginalMsg)
    message = {
      language: lang,
      message: message,
      orig: path,
      vars: variables,
    };
  if (fn) return fn(message);
  return message;
}

/* RFC 5424 Syslog Message Severities
 * 0 Emergency: system is unusable
 * 1 Alert: action must be taken immediately
 * 2 Critical: critical conditions
 * 3 Error: error conditions
 * 4 Warning: warning conditions
 * 5 Notice: normal but significant condition
 * 6 Informational: informational messages
 * 7 Debug: debug-level messages
 */

export function rfc5424(
  level: string,
  args: any[],
  print: (...args: any[]) => void,
  lang?: string
) {
  return packMessage(
    args,
    (msg) => {
      logPersistent(level, msg);
      if (consoleEnabled()) print(msg.message);
      return msg;
    },
    true,
    lang
  );
}

function myError(...args: any[]) {
  const msg = packMessage(args, null, true);
  logPersistent('error', msg);
  return new Error(msg.message);
}

module.exports.Error = myError;

// RFC 5424 Syslog Message Severities
export function emergency(...args: any[]) {
  return rfc5424('emergency', args, console.error);
}

export function alert(...args: any[]) {
  return rfc5424('alert', args, console.error);
}

export function critical(...args: any[]) {
  return rfc5424('critical', args, console.error);
}

export function error(...args: any[]) {
  return rfc5424('error', args, console.error);
}

export function warning(...args: any[]) {
  return rfc5424('warning', args, console.error);
}

export function notice(...args: any[]) {
  return rfc5424('notice', args, console.log);
}

export function informational(...args: any[]) {
  return rfc5424('informational', args, console.log);
}

export function debug(...args: any[]) {
  return rfc5424('debug', args, console.log);
}

export function warn(...args: any[]) {
  return rfc5424('warn', args, console.error);
}
export function info(...args: any[]) {
  return rfc5424('info', args, console.log);
}
export function log(...args: any[]) {
  return rfc5424('log', args, console.log);
}

export function help(...args: any[]) {
  return rfc5424('help', args, console.log);
}

export function data(...args: any[]) {
  return rfc5424('data', args, console.log);
}

export function prompt(...args: any[]) {
  return rfc5424('prompt', args, console.log);
}

export function verbose(...args: any[]) {
  return rfc5424('verbose', args, console.log);
}

export function input(...args: any[]) {
  return rfc5424('input', args, console.log);
}

export function silly(...args: any[]) {
  return rfc5424('silly', args, console.log);
}

/**
 * Globalize.formatNumber wrapper returns a string.
 *
 * @param {value} integer or float
 * @param {object} The options (optional); if null, use the StrongLoop default.
 *     Strongly recommended to set NO options and let strong-globalize use
 *     the StrongLoop default for consistency across StrongLoop products.
 *     See https://www.npmjs.com/package/globalize#number-module
 */
export function formatNumber(
  value: number,
  options?: AnyObject,
  lang?: string
) {
  assert(value);
  if (!STRONGLOOP_GLB.DEFAULT_LANG) setDefaultLanguage(lang);
  lang = (lang || STRONGLOOP_GLB.DEFAULT_LANG)!;
  options = options || SL_DEFAULT_NUMBER;
  const G = STRONGLOOP_GLB.bundles![lang];
  let msg = null;
  try {
    msg = G.formatNumber(value, options);
  } catch (e) {
    msg = value.toString();
    dbg('*** formatNumber error: value:%s', msg);
  }
  return msg;
}

/**
 * Globalize.formatDate wrapper returns a string.
 *
 * @param {Date object} such as new Date()
 * @param {object} The options (optional); if null, use the StrongLoop default.
 *     Strongly recommended to set NO options and let strong-globalize use
 *     the StrongLoop default for consistency across StrongLoop products.
 *     See https://www.npmjs.com/package/globalize#date-module
 */
export function formatDate(value: Date, options?: AnyObject, lang?: string) {
  assert(value);
  if (!STRONGLOOP_GLB.DEFAULT_LANG) setDefaultLanguage(lang);
  lang = (lang || STRONGLOOP_GLB.DEFAULT_LANG)!;
  options = options || SL_DEFAULT_DATETIME;
  const G = STRONGLOOP_GLB.bundles![lang];
  let msg = null;
  try {
    msg = G.formatDate(value, options);
  } catch (e) {
    msg = value.toString();
    dbg('*** formatDate error: value:%s', msg);
  }
  return msg;
}

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
export function formatCurrency(
  value: any,
  currencySymbol: string,
  options?: AnyObject,
  lang?: string
) {
  assert(value && currencySymbol);
  if (!STRONGLOOP_GLB.DEFAULT_LANG) setDefaultLanguage(lang);
  lang = lang || STRONGLOOP_GLB.DEFAULT_LANG;
  options = options || SL_DEFAULT_CURRENCY;
  const G = STRONGLOOP_GLB.bundles![lang!];
  let msg = null;
  try {
    msg = G.formatCurrency(value, currencySymbol, options);
  } catch (e) {
    msg = currencySymbol.toString() + value.toString();
    dbg(
      '*** formatCurrency error: value:%s, currencySymbol:%s',
      value,
      currencySymbol
    );
  }
  return msg;
}

export function loadGlobalize(lang?: string, enumerateNodeModules?: boolean) {
  assert(helper.isSupportedLanguage(lang), 'Not supported: ' + lang);
  if (!STRONGLOOP_GLB.versionSG) {
    const versionSG = helper.getPackageVersion(pathUtil.join(__dirname, '..'));
    const versionG = helper.getPackageVersion(
      pathUtil.join(__dirname, '..', 'node_modules', 'globalize')
    );
    Object.assign(STRONGLOOP_GLB, {
      versionSG: versionSG,
      versionG: versionG,
      bundles: {},
      formatters: new MapCache(),
      getHash: memoize(md5),
      load: Globalize.load,
      locale: Globalize.locale,
      loadMessages: Globalize.loadMessages,
      DEFAULT_LANG: helper.ENGLISH,
      APP_LANGS: readAppLanguagesSync(),
      LOG_FN: null,
      DISABLE_CONSOLE: false,
      MASTER_ROOT_DIR: helper.getRootDir(),
      MSG_RES_LOADED: [],
      AUTO_MSG_LOADING: helper.AML_DEFAULT,
      PSEUDO_LOC_PREAMBLE:
        process.env.STRONG_GLOBALIZE_PSEUDO_LOC_PREAMBLE || '',
    });
    loadCldr(helper.ENGLISH);
    STRONGLOOP_GLB.bundles![helper.ENGLISH] = new Globalize(helper.ENGLISH);
    STRONGLOOP_GLB.locale!(helper.ENGLISH);
    helper.loadMsgFromFile(
      helper.ENGLISH,
      helper.getRootDir(),
      enumerateNodeModules
    );
  }
  if (!(lang! in STRONGLOOP_GLB.bundles!)) {
    loadCldr(lang!);
    STRONGLOOP_GLB.bundles![lang!] = new Globalize(lang!);
    STRONGLOOP_GLB.locale!(lang);
    helper.loadMsgFromFile(lang!, helper.getRootDir(), enumerateNodeModules);
  }
  return STRONGLOOP_GLB.bundles![lang!];
}

function loadCldr(lang: string) {
  assert(
    STRONGLOOP_GLB &&
      (!STRONGLOOP_GLB.bundles || !STRONGLOOP_GLB.bundles[lang]),
    'CLDR already loaded for ' + lang
  );
  const cldrDir = pathUtil.join(__dirname, '..', 'cldr');
  helper.enumerateFilesSync(cldrDir, null, ['json'], false, false, function (
    content,
    filePath
  ) {
    let cldr = null;
    try {
      cldr = JSON.parse(content);
    } catch (e) {
      throw new Error('*** CLDR read error on ' + process.platform);
    }
    const cldrMain: AnyObject = {main: {}};
    cldrMain.main[lang] = cldr.main[lang];
    STRONGLOOP_GLB.load!(cldrMain);
    if (lang === helper.ENGLISH) {
      const cldrSupplemental = {supplemental: cldr.supplemental};
      STRONGLOOP_GLB.load!(cldrSupplemental);
    }
  });
}

/**
 *
 * Persistent logging
 *
 */

// const syslogLevels = { // RFC5424
//   emerg: 0,
//   alert: 1,
//   crit: 2,
//   error: 3,
//   warning: 4,
//   notice: 5,
//   info: 6,
//   debug: 7,
// };

// const npmLevels = {
//   error: 0,
//   warn: 1,
//   info: 2,
//   verbose: 3,
//   debug: 4,
//   silly: 5,
// };

export function consoleEnabled() {
  if (!STRONGLOOP_GLB.DEFAULT_LANG) setDefaultLanguage();
  return !STRONGLOOP_GLB.DISABLE_CONSOLE;
}

/**
 *
 */
export function setPersistentLogging(
  logFn: (level: string, message: {[name: string]: any}) => void,
  disableConsole?: boolean
) {
  assert(logFn);
  assert(typeof logFn === 'function');
  if (!STRONGLOOP_GLB.DEFAULT_LANG) setDefaultLanguage();
  STRONGLOOP_GLB.DISABLE_CONSOLE = !!disableConsole;
  try {
    const message =
      'StrongGlobalize persistent logging started at ' + new Date();
    logFn('info', {
      language: helper.ENGLISH,
      message: message,
      orig: message,
      vars: [],
    });
    STRONGLOOP_GLB.LOG_FN = logFn;
  } catch (e) {
    STRONGLOOP_GLB.LOG_FN = undefined;
  }
}

export function logPersistent(level: string = 'info', message: any) {
  if (!STRONGLOOP_GLB.DEFAULT_LANG) setDefaultLanguage();
  if (!STRONGLOOP_GLB.LOG_FN) return;
  level = level || 'info';
  if (typeof STRONGLOOP_GLB.LOG_FN === 'function') {
    STRONGLOOP_GLB.LOG_FN(level, message);
  }
}
