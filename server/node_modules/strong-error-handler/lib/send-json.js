// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: strong-error-handler
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

const safeStringify = require('fast-safe-stringify');

module.exports = function sendJson(res, data, options) {
  options = options || {};
  // Set `options.rootProperty` to not wrap the data into an `error` object
  const err = options.rootProperty === false ? data : {
    // Use `options.rootProperty`, if not set, default to `error`
    [options.rootProperty || 'error']: data,
  };
  const content = safeStringify(err);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(content, 'utf-8');
};
