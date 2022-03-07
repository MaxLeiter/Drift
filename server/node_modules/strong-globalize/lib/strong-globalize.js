"use strict";
// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// Node module: strong-globalize
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrongGlobalize = void 0;
// Multi-instance strong-globalize
const globalize = require("./globalize");
const helper = require("./helper");
const path = require("path");
const config_1 = require("./config");
const helper_1 = require("./helper");
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
    Cldr.prototype.get = function (paths) {
        if (Array.isArray(paths)) {
            paths = paths.map(function (p) {
                return p === 'zz' ? 'en' : p;
            });
        }
        // tslint:disable-next-line:no-invalid-this
        return get.call(this, paths);
    };
}
catch (e) {
    // Ignore
}
class StrongGlobalize {
    constructor(options) {
        if (typeof options === 'string') {
            StrongGlobalize.SetRootDir(options);
            options = undefined;
        }
        if (!config_1.STRONGLOOP_GLB.DEFAULT_LANG) {
            globalize.setDefaultLanguage();
            globalize.setAppLanguages();
        }
        const defaults = {
            language: config_1.STRONGLOOP_GLB.DEFAULT_LANG,
            appLanguages: config_1.STRONGLOOP_GLB.APP_LANGS,
        };
        this._options = options ? Object.assign(defaults, options) : defaults;
    }
    static SetRootDir(rootDir, options) {
        const defaults = {
            autonomousMsgLoading: helper.AML_DEFAULT,
        };
        options = options ? Object.assign(defaults, options) : defaults;
        options.autonomousMsgLoading = helper.validateAmlValue(options.autonomousMsgLoading);
        if (!options.autonomousMsgLoading) {
            options.autonomousMsgLoading = defaults.autonomousMsgLoading;
        }
        globalize.setRootDir(rootDir);
        if (!config_1.STRONGLOOP_GLB.AUTO_MSG_LOADING) {
            globalize.setDefaultLanguage();
            config_1.STRONGLOOP_GLB.AUTO_MSG_LOADING = options.autonomousMsgLoading;
        }
        if (path.resolve(rootDir) !== path.resolve(config_1.STRONGLOOP_GLB.MASTER_ROOT_DIR) &&
            helper.isLoadMessages(rootDir)) {
            const langs = Object.keys(config_1.STRONGLOOP_GLB.bundles);
            langs.forEach(function (lang) {
                helper.loadMsgFromFile(lang, rootDir);
            });
        }
    }
    setLanguage(lang) {
        if (lang)
            lang = helper_1.getLangAlias(lang);
        lang = helper.isSupportedLanguage(lang)
            ? lang
            : config_1.STRONGLOOP_GLB.DEFAULT_LANG;
        this._options.language = lang;
    }
    getLanguage() {
        return this._options.language;
    }
    c(value, currencySymbol, options) {
        globalize.loadGlobalize(this._options.language);
        return globalize.formatCurrency(value, currencySymbol, options, this._options.language);
    }
    formatCurrency(value, currencySymbol, options) {
        return this.c(value, currencySymbol, options);
    }
    d(value, options) {
        globalize.loadGlobalize(this._options.language);
        return globalize.formatDate(value, options, this._options.language);
    }
    formatDate(value, options) {
        return this.d(value, options);
    }
    n(value, options) {
        globalize.loadGlobalize(this._options.language);
        return globalize.formatNumber(value, options, this._options.language);
    }
    formatNumber(value, options) {
        return this.n(value, options);
    }
    m(msgPath, variables) {
        globalize.loadGlobalize(this._options.language);
        return globalize.formatMessage(msgPath, variables, this._options.language);
    }
    formatMessage(msgPath, variables) {
        return this.m(msgPath, variables);
    }
    t(msgPath, variables) {
        return this.m(msgPath, variables);
    }
    Error(...args) {
        globalize.loadGlobalize(this._options.language);
        const msg = globalize.packMessage(args, null, true, this._options.language);
        globalize.logPersistent('error', msg);
        return Error(msg.message);
    }
    f(...args) {
        globalize.loadGlobalize(this._options.language);
        return globalize.packMessage(args, null, false, this._options.language);
    }
    format(...args) {
        return this.f(...args);
    }
    ewrite(...args) {
        globalize.loadGlobalize(this._options.language);
        return globalize.packMessage(args, function (msg) {
            globalize.logPersistent(msg, 'error');
            if (globalize.consoleEnabled())
                process.stderr.write(msg.message);
            return msg;
        }, true, this._options.language);
    }
    owrite(...args) {
        globalize.loadGlobalize(this._options.language);
        return globalize.packMessage(args, function (msg) {
            globalize.logPersistent(msg, 'error');
            if (globalize.consoleEnabled())
                process.stdout.write(msg.message);
        }, true, this._options.language);
    }
    write(...args) {
        this.owrite(...args);
    }
    // RFC 5424 Syslog Message Severities
    emergency(...args) {
        globalize.loadGlobalize(this._options.language);
        return globalize.rfc5424('emergency', args, console.error, this._options.language);
    }
    alert(...args) {
        globalize.loadGlobalize(this._options.language);
        return globalize.rfc5424('alert', args, console.error, this._options.language);
    }
    critical(...args) {
        globalize.loadGlobalize(this._options.language);
        return globalize.rfc5424('critical', args, console.error, this._options.language);
    }
    error(...args) {
        globalize.loadGlobalize(this._options.language);
        return globalize.rfc5424('error', args, console.error, this._options.language);
    }
    warning(...args) {
        globalize.loadGlobalize(this._options.language);
        return globalize.rfc5424('warning', args, console.error, this._options.language);
    }
    notice(...args) {
        globalize.loadGlobalize(this._options.language);
        return globalize.rfc5424('notice', args, console.log, this._options.language);
    }
    informational(...args) {
        globalize.loadGlobalize(this._options.language);
        return globalize.rfc5424('informational', args, console.log, this._options.language);
    }
    debug(...args) {
        globalize.loadGlobalize(this._options.language);
        return globalize.rfc5424('debug', args, console.log, this._options.language);
    }
    // Node.js console
    warn(...args) {
        globalize.loadGlobalize(this._options.language);
        return globalize.rfc5424('warn', args, console.error, this._options.language);
    }
    info(...args) {
        globalize.loadGlobalize(this._options.language);
        return globalize.rfc5424('info', args, console.log, this._options.language);
    }
    log(...args) {
        globalize.loadGlobalize(this._options.language);
        return globalize.rfc5424('log', args, console.log, this._options.language);
    }
    // Misc Logging Levels
    help(...args) {
        globalize.loadGlobalize(this._options.language);
        return globalize.rfc5424('help', args, console.log, this._options.language);
    }
    data(...args) {
        globalize.loadGlobalize(this._options.language);
        return globalize.rfc5424('data', args, console.log, this._options.language);
    }
    prompt(...args) {
        globalize.loadGlobalize(this._options.language);
        return globalize.rfc5424('prompt', args, console.log, this._options.language);
    }
    verbose(...args) {
        globalize.loadGlobalize(this._options.language);
        return globalize.rfc5424('verbose', args, console.log, this._options.language);
    }
    input(...args) {
        globalize.loadGlobalize(this._options.language);
        return globalize.rfc5424('input', args, console.log, this._options.language);
    }
    silly(...args) {
        globalize.loadGlobalize(this._options.language);
        return globalize.rfc5424('silly', args, console.log, this._options.language);
    }
    http(req) {
        const matchingLang = helper.getLanguageFromRequest(req, this._options.appLanguages, this._options.language);
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
exports.StrongGlobalize = StrongGlobalize;
StrongGlobalize.helper = helper;
StrongGlobalize.globalize = globalize;
StrongGlobalize.STRONGLOOP_GLB = config_1.STRONGLOOP_GLB;
StrongGlobalize.SetPersistentLogging = globalize.setPersistentLogging;
StrongGlobalize.SetDefaultLanguage = globalize.setDefaultLanguage;
StrongGlobalize.SetAppLanguages = globalize.setAppLanguages;
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
StrongGlobalize.sgCache = new Map(); /* eslint-env es6 */
//# sourceMappingURL=strong-globalize.js.map