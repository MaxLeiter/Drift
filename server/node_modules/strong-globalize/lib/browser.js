"use strict";
// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// Node module: strong-globalize
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0
// tslint:disable:no-any
const util = require("util");
function noop() { }
class StrongGlobalize {
    constructor() {
        this.setLanguage = noop;
        this.formatCurrency = this.c;
        this.d = function (value, options) {
            return value.toString();
        };
        this.formatDate = this.d;
        this.n = function (value, options) {
            return value.toString();
        };
        this.formatNumber = this.n;
        this.m = function (path, variables) {
            return util.format.apply(null, [path].concat(variables));
        };
        this.formatMessage = this.m;
        this.t = this.m;
        this.format = this.f;
        this.write = this.owrite;
    }
    getLanguage() {
        return 'en';
    }
    c(value, currencySymbol, options) {
        return currencySymbol + ' ' + value.toString();
    }
    Error(...args) {
        return Error.apply(null, args);
    }
    f(...args) {
        return util.format.apply(null, args);
    }
    ewrite(...args) {
        return console.error(args);
    }
    owrite(...args) {
        return console.log(args);
    }
    rfc5424(type, args, fn) {
        // Convert args from function args object to a regular array
        args = Array.prototype.slice.call(args);
        if (typeof args[0] === 'string') {
            // The first argument may contain formatting instructions like %s
            // which must be preserved.
            args[0] = type + ': ' + args[0];
        }
        else {
            args = [type, ': '].concat(args);
        }
        return fn.apply(console, args);
    }
    // RFC 5424 Syslog Message Severities
    emergency(...args) {
        return this.rfc5424('emergency', args, console.error);
    }
    alert(...args) {
        return this.rfc5424('alert', args, console.error);
    }
    critical(...args) {
        return this.rfc5424('critical', args, console.error);
    }
    error(...args) {
        return this.rfc5424('error', args, console.error);
    }
    warning(...args) {
        return this.rfc5424('warning', args, console.warn);
    }
    notice(...args) {
        return this.rfc5424('notice', args, console.log);
    }
    informational(...args) {
        return this.rfc5424('informational', args, console.log);
    }
    debug(...args) {
        return this.rfc5424('debug', args, console.log);
    }
    // Node.js console
    warn(...args) {
        return this.rfc5424('warn', args, console.warn);
    }
    info(...args) {
        return this.rfc5424('info', args, console.log);
    }
    log(...args) {
        return this.rfc5424('log', args, console.log);
    }
    // Misc Logging Levels
    help(...args) {
        return this.rfc5424('help', args, console.log);
    }
    data(...args) {
        return this.rfc5424('data', args, console.log);
    }
    prompt(...args) {
        return this.rfc5424('prompt', args, console.log);
    }
    verbose(...args) {
        return this.rfc5424('verbose', args, console.log);
    }
    input(...args) {
        return this.rfc5424('input', args, console.log);
    }
    silly(...args) {
        return this.rfc5424('silly', args, console.log);
    }
}
StrongGlobalize.SetRootDir = noop;
StrongGlobalize.SetDefaultLanguage = noop;
StrongGlobalize.SetPersistentLogging = noop;
module.exports = StrongGlobalize;
//# sourceMappingURL=browser.js.map