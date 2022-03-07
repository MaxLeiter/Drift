"use strict";
// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// Node module: strong-globalize
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.logPersistent = exports.setPersistentLogging = exports.consoleEnabled = exports.loadGlobalize = exports.formatCurrency = exports.formatDate = exports.formatNumber = exports.silly = exports.input = exports.verbose = exports.prompt = exports.data = exports.help = exports.log = exports.info = exports.warn = exports.debug = exports.informational = exports.notice = exports.warning = exports.error = exports.critical = exports.alert = exports.emergency = exports.rfc5424 = exports.packMessage = exports.formatJson = exports.formatMessage = exports.setAppLanguages = exports.setDefaultLanguage = exports.STRONGLOOP_GLB = exports.m = exports.t = exports.n = exports.d = exports.c = exports.setRootDir = void 0;
//tslint:disable:no-any
const assert = require("assert");
const debugModule = require("debug");
const fs = require("fs");
const Globalize = require("globalize");
const yamljs_1 = require("yamljs");
const config_1 = require("./config");
const helper = require("./helper");
const helper_1 = require("./helper");
const dbg = debugModule('strong-globalize');
const osLocale = require('os-locale');
const MapCache = require('lodash/_MapCache');
const md5 = require('md5');
const memoize = require('lodash/memoize');
const pathUtil = require('path');
const util = require('util');
var helper_2 = require("./helper");
Object.defineProperty(exports, "setRootDir", { enumerable: true, get: function () { return helper_2.setRootDir; } });
exports.c = formatCurrency;
exports.d = formatDate;
exports.n = formatNumber;
exports.t = formatMessage;
exports.m = formatMessage;
var config_2 = require("./config");
Object.defineProperty(exports, "STRONGLOOP_GLB", { enumerable: true, get: function () { return config_2.STRONGLOOP_GLB; } });
/**
 * StrongLoop Defaults
 */
const SL_DEFAULT_DATETIME = { datetime: 'medium' };
const SL_DEFAULT_NUMBER = { round: 'floor' };
const SL_DEFAULT_CURRENCY = { style: 'name' };
const OS_LANG = osLanguage();
let MY_APP_LANG = process.env.STRONGLOOP_GLOBALIZE_APP_LANGUAGE;
MY_APP_LANG = helper.isSupportedLanguage(MY_APP_LANG) ? MY_APP_LANG : null;
function osLanguage() {
    const locale = osLocale.sync();
    const lang = locale.substring(0, 2);
    if (helper.isSupportedLanguage(lang))
        return lang;
    if (lang === 'zh') {
        const region = locale.substring(3);
        if (region === 'CN')
            return 'zh-Hans';
        if (region === 'TW')
            return 'zh-Hant';
        if (region === 'Hans')
            return 'zh-Hans';
        if (region === 'Hant')
            return 'zh-Hant';
    }
}
/**
 * setDefaultLanguage
 *
 * @param {string} (optional, default: `'en'`) Language ID.
 *     It tries to use OS language, then falls back to 'en'
 */
function setDefaultLanguage(lang) {
    if (lang)
        lang = helper_1.getLangAlias(lang);
    lang = helper.isSupportedLanguage(lang) ? lang : undefined;
    lang = lang || MY_APP_LANG || OS_LANG || helper.ENGLISH;
    loadGlobalize(lang);
    if (lang !== helper.ENGLISH) {
        loadGlobalize(helper.ENGLISH);
    }
    config_1.STRONGLOOP_GLB.locale(lang);
    config_1.STRONGLOOP_GLB.DEFAULT_LANG = lang;
    return lang;
}
exports.setDefaultLanguage = setDefaultLanguage;
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
function setAppLanguages(langs) {
    langs = langs || readAppLanguagesSync() || [];
    config_1.STRONGLOOP_GLB.APP_LANGS = langs;
    return langs;
}
exports.setAppLanguages = setAppLanguages;
function readAppLanguagesSync() {
    try {
        const langs = fs.readdirSync(pathUtil.join(config_1.STRONGLOOP_GLB.MASTER_ROOT_DIR, 'intl'));
        return langs;
    }
    catch (ex) {
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
function formatMessage(path, variables, lang) {
    assert(path);
    if (!config_1.STRONGLOOP_GLB.DEFAULT_LANG)
        setDefaultLanguage();
    let message = path;
    if (helper.hashKeys(path)) {
        if (!config_1.STRONGLOOP_GLB.getHash) {
            config_1.STRONGLOOP_GLB.getHash = memoize(md5);
        }
        path = config_1.STRONGLOOP_GLB.getHash(path);
    }
    lang = lang || config_1.STRONGLOOP_GLB.DEFAULT_LANG;
    dbg('~~~ lang = %s %s %j %s', lang, path, variables, __filename);
    const trailer = helper.getTrailerAfterDot(path);
    if (trailer === 'json' || trailer === 'yml' || trailer === 'yaml') {
        const fullPath = pathUtil.join(helper.getRootDir(), path);
        return formatJson(fullPath, JSON.parse(variables), lang);
    }
    function formatMsgInline(language) {
        const g = config_1.STRONGLOOP_GLB.bundles[language];
        if (!config_1.STRONGLOOP_GLB.formatters) {
            config_1.STRONGLOOP_GLB.formatters = new MapCache();
        }
        const allFormatters = config_1.STRONGLOOP_GLB.formatters;
        let langFormatters;
        if (allFormatters.has(language)) {
            langFormatters = allFormatters.get(language);
        }
        else {
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
        message = formatMsgInline(lang);
    }
    catch (e) {
        if (lang === helper.ENGLISH) {
            message = sanitizeMsg(message, variables);
            dbg('*** %s not found for %s. Fall back to: "%s" ***  %s', path, lang, message, e);
        }
        else {
            dbg('*** %s for %s not localized. Fall back to English. ***  %s', path, lang, e);
            try {
                message = formatMsgInline(helper.ENGLISH);
            }
            catch (e) {
                message = sanitizeMsg(message, variables);
                dbg('*** %s not found for %s. Fall back to: "%s" ***  %s', path, lang, message, e);
            }
        }
    }
    if (config_1.STRONGLOOP_GLB.PSEUDO_LOC_PREAMBLE) {
        message = config_1.STRONGLOOP_GLB.PSEUDO_LOC_PREAMBLE + message;
    }
    return message;
}
exports.formatMessage = formatMessage;
function formatJson(fullPath, variables, lang) {
    assert(fullPath === pathUtil.resolve(helper.getRootDir(), fullPath), '*** full path is required to format json/yaml file: ' + fullPath);
    const fileType = helper.getTrailerAfterDot(fullPath);
    let jsonData = null;
    try {
        const contentStr = fs.readFileSync(fullPath, 'utf8');
        if (fileType === 'json')
            jsonData = JSON.parse(contentStr);
        if (fileType === 'yml' || fileType === 'yaml')
            jsonData = yamljs_1.parse(contentStr);
    }
    catch (_e) {
        return '*** read failure: ' + fullPath;
    }
    const msgs = helper.scanJson(variables, jsonData);
    const transMsgs = [];
    msgs.forEach(function (msg) {
        const transMsg = formatMessage(msg, undefined, lang);
        transMsgs.push(transMsg);
    });
    helper.replaceJson(variables, jsonData, transMsgs);
    return jsonData;
}
exports.formatJson = formatJson;
function sanitizeMsg(message, variables) {
    message = message.replace(/}}/g, '').replace(/{{/g, '');
    if (typeof variables === 'string' ||
        (Array.isArray(variables) && variables.length > 0)) {
        const sanitizedMsg = message.replace(/%[sdj]/g, '%s');
        message = util.format.apply(util, [sanitizedMsg].concat(variables));
    }
    return message;
}
function packMessage(args, fn, withOriginalMsg, lang) {
    const path = args[0];
    const percentInKey = helper.percent(path);
    const txtWithTwoOrMoreArgs = helper.getTrailerAfterDot(path) === 'txt' && args.length > 2;
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
    if (fn)
        return fn(message);
    return message;
}
exports.packMessage = packMessage;
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
function rfc5424(level, args, print, lang) {
    return packMessage(args, (msg) => {
        logPersistent(level, msg);
        if (consoleEnabled())
            print(msg.message);
        return msg;
    }, true, lang);
}
exports.rfc5424 = rfc5424;
function myError(...args) {
    const msg = packMessage(args, null, true);
    logPersistent('error', msg);
    return new Error(msg.message);
}
module.exports.Error = myError;
// RFC 5424 Syslog Message Severities
function emergency(...args) {
    return rfc5424('emergency', args, console.error);
}
exports.emergency = emergency;
function alert(...args) {
    return rfc5424('alert', args, console.error);
}
exports.alert = alert;
function critical(...args) {
    return rfc5424('critical', args, console.error);
}
exports.critical = critical;
function error(...args) {
    return rfc5424('error', args, console.error);
}
exports.error = error;
function warning(...args) {
    return rfc5424('warning', args, console.error);
}
exports.warning = warning;
function notice(...args) {
    return rfc5424('notice', args, console.log);
}
exports.notice = notice;
function informational(...args) {
    return rfc5424('informational', args, console.log);
}
exports.informational = informational;
function debug(...args) {
    return rfc5424('debug', args, console.log);
}
exports.debug = debug;
function warn(...args) {
    return rfc5424('warn', args, console.error);
}
exports.warn = warn;
function info(...args) {
    return rfc5424('info', args, console.log);
}
exports.info = info;
function log(...args) {
    return rfc5424('log', args, console.log);
}
exports.log = log;
function help(...args) {
    return rfc5424('help', args, console.log);
}
exports.help = help;
function data(...args) {
    return rfc5424('data', args, console.log);
}
exports.data = data;
function prompt(...args) {
    return rfc5424('prompt', args, console.log);
}
exports.prompt = prompt;
function verbose(...args) {
    return rfc5424('verbose', args, console.log);
}
exports.verbose = verbose;
function input(...args) {
    return rfc5424('input', args, console.log);
}
exports.input = input;
function silly(...args) {
    return rfc5424('silly', args, console.log);
}
exports.silly = silly;
/**
 * Globalize.formatNumber wrapper returns a string.
 *
 * @param {value} integer or float
 * @param {object} The options (optional); if null, use the StrongLoop default.
 *     Strongly recommended to set NO options and let strong-globalize use
 *     the StrongLoop default for consistency across StrongLoop products.
 *     See https://www.npmjs.com/package/globalize#number-module
 */
function formatNumber(value, options, lang) {
    assert(value);
    if (!config_1.STRONGLOOP_GLB.DEFAULT_LANG)
        setDefaultLanguage(lang);
    lang = (lang || config_1.STRONGLOOP_GLB.DEFAULT_LANG);
    options = options || SL_DEFAULT_NUMBER;
    const G = config_1.STRONGLOOP_GLB.bundles[lang];
    let msg = null;
    try {
        msg = G.formatNumber(value, options);
    }
    catch (e) {
        msg = value.toString();
        dbg('*** formatNumber error: value:%s', msg);
    }
    return msg;
}
exports.formatNumber = formatNumber;
/**
 * Globalize.formatDate wrapper returns a string.
 *
 * @param {Date object} such as new Date()
 * @param {object} The options (optional); if null, use the StrongLoop default.
 *     Strongly recommended to set NO options and let strong-globalize use
 *     the StrongLoop default for consistency across StrongLoop products.
 *     See https://www.npmjs.com/package/globalize#date-module
 */
function formatDate(value, options, lang) {
    assert(value);
    if (!config_1.STRONGLOOP_GLB.DEFAULT_LANG)
        setDefaultLanguage(lang);
    lang = (lang || config_1.STRONGLOOP_GLB.DEFAULT_LANG);
    options = options || SL_DEFAULT_DATETIME;
    const G = config_1.STRONGLOOP_GLB.bundles[lang];
    let msg = null;
    try {
        msg = G.formatDate(value, options);
    }
    catch (e) {
        msg = value.toString();
        dbg('*** formatDate error: value:%s', msg);
    }
    return msg;
}
exports.formatDate = formatDate;
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
function formatCurrency(value, currencySymbol, options, lang) {
    assert(value && currencySymbol);
    if (!config_1.STRONGLOOP_GLB.DEFAULT_LANG)
        setDefaultLanguage(lang);
    lang = lang || config_1.STRONGLOOP_GLB.DEFAULT_LANG;
    options = options || SL_DEFAULT_CURRENCY;
    const G = config_1.STRONGLOOP_GLB.bundles[lang];
    let msg = null;
    try {
        msg = G.formatCurrency(value, currencySymbol, options);
    }
    catch (e) {
        msg = currencySymbol.toString() + value.toString();
        dbg('*** formatCurrency error: value:%s, currencySymbol:%s', value, currencySymbol);
    }
    return msg;
}
exports.formatCurrency = formatCurrency;
function loadGlobalize(lang, enumerateNodeModules) {
    assert(helper.isSupportedLanguage(lang), 'Not supported: ' + lang);
    if (!config_1.STRONGLOOP_GLB.versionSG) {
        const versionSG = helper.getPackageVersion(pathUtil.join(__dirname, '..'));
        const versionG = helper.getPackageVersion(pathUtil.join(__dirname, '..', 'node_modules', 'globalize'));
        Object.assign(config_1.STRONGLOOP_GLB, {
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
            PSEUDO_LOC_PREAMBLE: process.env.STRONG_GLOBALIZE_PSEUDO_LOC_PREAMBLE || '',
        });
        loadCldr(helper.ENGLISH);
        config_1.STRONGLOOP_GLB.bundles[helper.ENGLISH] = new Globalize(helper.ENGLISH);
        config_1.STRONGLOOP_GLB.locale(helper.ENGLISH);
        helper.loadMsgFromFile(helper.ENGLISH, helper.getRootDir(), enumerateNodeModules);
    }
    if (!(lang in config_1.STRONGLOOP_GLB.bundles)) {
        loadCldr(lang);
        config_1.STRONGLOOP_GLB.bundles[lang] = new Globalize(lang);
        config_1.STRONGLOOP_GLB.locale(lang);
        helper.loadMsgFromFile(lang, helper.getRootDir(), enumerateNodeModules);
    }
    return config_1.STRONGLOOP_GLB.bundles[lang];
}
exports.loadGlobalize = loadGlobalize;
function loadCldr(lang) {
    assert(config_1.STRONGLOOP_GLB &&
        (!config_1.STRONGLOOP_GLB.bundles || !config_1.STRONGLOOP_GLB.bundles[lang]), 'CLDR already loaded for ' + lang);
    const cldrDir = pathUtil.join(__dirname, '..', 'cldr');
    helper.enumerateFilesSync(cldrDir, null, ['json'], false, false, function (content, filePath) {
        let cldr = null;
        try {
            cldr = JSON.parse(content);
        }
        catch (e) {
            throw new Error('*** CLDR read error on ' + process.platform);
        }
        const cldrMain = { main: {} };
        cldrMain.main[lang] = cldr.main[lang];
        config_1.STRONGLOOP_GLB.load(cldrMain);
        if (lang === helper.ENGLISH) {
            const cldrSupplemental = { supplemental: cldr.supplemental };
            config_1.STRONGLOOP_GLB.load(cldrSupplemental);
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
function consoleEnabled() {
    if (!config_1.STRONGLOOP_GLB.DEFAULT_LANG)
        setDefaultLanguage();
    return !config_1.STRONGLOOP_GLB.DISABLE_CONSOLE;
}
exports.consoleEnabled = consoleEnabled;
/**
 *
 */
function setPersistentLogging(logFn, disableConsole) {
    assert(logFn);
    assert(typeof logFn === 'function');
    if (!config_1.STRONGLOOP_GLB.DEFAULT_LANG)
        setDefaultLanguage();
    config_1.STRONGLOOP_GLB.DISABLE_CONSOLE = !!disableConsole;
    try {
        const message = 'StrongGlobalize persistent logging started at ' + new Date();
        logFn('info', {
            language: helper.ENGLISH,
            message: message,
            orig: message,
            vars: [],
        });
        config_1.STRONGLOOP_GLB.LOG_FN = logFn;
    }
    catch (e) {
        config_1.STRONGLOOP_GLB.LOG_FN = undefined;
    }
}
exports.setPersistentLogging = setPersistentLogging;
function logPersistent(level = 'info', message) {
    if (!config_1.STRONGLOOP_GLB.DEFAULT_LANG)
        setDefaultLanguage();
    if (!config_1.STRONGLOOP_GLB.LOG_FN)
        return;
    level = level || 'info';
    if (typeof config_1.STRONGLOOP_GLB.LOG_FN === 'function') {
        config_1.STRONGLOOP_GLB.LOG_FN(level, message);
    }
}
exports.logPersistent = logPersistent;
//# sourceMappingURL=globalize.js.map