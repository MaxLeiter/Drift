// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// Node module: strong-globalize
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

// tslint:disable:no-any

import * as util from 'util';
import {AnyObject} from './config';

function noop() {}

export = StrongGlobalize;

class StrongGlobalize {
  static SetRootDir = noop;
  static SetDefaultLanguage = noop;
  static SetPersistentLogging = noop;

  setLanguage = noop;

  getLanguage() {
    return 'en';
  }

  c(value: any, currencySymbol: string, options: AnyObject) {
    return currencySymbol + ' ' + value.toString();
  }
  formatCurrency = this.c;

  d = function (value: Date, options: AnyObject) {
    return value.toString();
  };
  formatDate = this.d;

  n = function (value: number, options: AnyObject) {
    return value.toString();
  };
  formatNumber = this.n;

  m = function (path: string, variables: any) {
    return util.format.apply(null, [path].concat(variables));
  };
  formatMessage = this.m;
  t = this.m;

  Error(...args: any[]) {
    return Error.apply(null, args);
  }

  f(...args: any[]) {
    return util.format.apply(null, args);
  }

  format = this.f;

  ewrite(...args: any[]) {
    return console.error(args);
  }
  owrite(...args: any[]) {
    return console.log(args);
  }
  write = this.owrite;

  rfc5424(type: string, args: any[], fn: (...args: any[]) => void) {
    // Convert args from function args object to a regular array
    args = Array.prototype.slice.call(args);
    if (typeof args[0] === 'string') {
      // The first argument may contain formatting instructions like %s
      // which must be preserved.
      args[0] = type + ': ' + args[0];
    } else {
      args = [type, ': '].concat(args);
    }
    return fn.apply(console, args);
  }

  // RFC 5424 Syslog Message Severities
  emergency(...args: any[]) {
    return this.rfc5424('emergency', args, console.error);
  }
  alert(...args: any[]) {
    return this.rfc5424('alert', args, console.error);
  }
  critical(...args: any[]) {
    return this.rfc5424('critical', args, console.error);
  }
  error(...args: any[]) {
    return this.rfc5424('error', args, console.error);
  }
  warning(...args: any[]) {
    return this.rfc5424('warning', args, console.warn);
  }
  notice(...args: any[]) {
    return this.rfc5424('notice', args, console.log);
  }
  informational(...args: any[]) {
    return this.rfc5424('informational', args, console.log);
  }
  debug(...args: any[]) {
    return this.rfc5424('debug', args, console.log);
  }

  // Node.js console
  warn(...args: any[]) {
    return this.rfc5424('warn', args, console.warn);
  }
  info(...args: any[]) {
    return this.rfc5424('info', args, console.log);
  }
  log(...args: any[]) {
    return this.rfc5424('log', args, console.log);
  }

  // Misc Logging Levels
  help(...args: any[]) {
    return this.rfc5424('help', args, console.log);
  }
  data(...args: any[]) {
    return this.rfc5424('data', args, console.log);
  }
  prompt(...args: any[]) {
    return this.rfc5424('prompt', args, console.log);
  }
  verbose(...args: any[]) {
    return this.rfc5424('verbose', args, console.log);
  }
  input(...args: any[]) {
    return this.rfc5424('input', args, console.log);
  }
  silly(...args: any[]) {
    return this.rfc5424('silly', args, console.log);
  }
}
