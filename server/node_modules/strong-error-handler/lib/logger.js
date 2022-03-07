// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: strong-error-handler
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

const format = require('util').format;
const g = require('strong-globalize')();

module.exports = function logToConsole(req, err) {
  if (!Array.isArray(err)) {
    g.error('Request %s %s failed: %s',
      req.method, req.url, err.stack || err);
    return;
  }

  const errMsg = g.f('Request %s %s failed with multiple errors:\n',
    req.method, req.url);
  const errors = err.map(formatError).join('\n');
  console.error(errMsg, errors);
};

function formatError(err) {
  return format('%s', err.stack || err);
}
