// Copyright IBM Corp. 2016,2018. All Rights Reserved.
// Node module: strong-error-handler
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';
const accepts = require('accepts');
const debug = require('debug')('strong-error-handler:http-response');
const sendJson = require('./send-json');
const sendHtml = require('./send-html');
const sendXml = require('./send-xml');
const util = require('util');

module.exports = negotiateContentProducer;

/**
 * Handles req.accepts and req.query._format and options.defaultType
 * to resolve the correct operation
 *
 * @param req request object
 * @param {Function} logWarning a logger function for reporting warnings
 * @param {Object} options options of strong-error-handler
 * @returns {Function} Operation function with signature `fn(res, data)`
 */
function negotiateContentProducer(req, logWarning, options) {
  const SUPPORTED_TYPES = [
    'application/json', 'json',
    'text/html', 'html',
    'text/xml', 'xml',
  ];

  options = options || {};
  let defaultType = 'json';

  // checking if user provided defaultType is supported
  if (options.defaultType) {
    if (SUPPORTED_TYPES.indexOf(options.defaultType) > -1) {
      debug('Accepting options.defaultType `%s`', options.defaultType);
      defaultType = options.defaultType;
    } else {
      debug('defaultType: `%s` is not supported, ' +
        'falling back to defaultType: `%s`', options.defaultType, defaultType);
    }
  }

  // decide to use resolvedType or defaultType
  // Please note that accepts assumes the order of content-type is provided
  // in the priority returned
  // example
  // Accepts: text/html, */*, application/json ---> will resolve as text/html
  // Accepts: application/json, */*, text/html ---> will resolve as application/json
  // Accepts: */*, application/json, text/html ---> will resolve as application/json
  // eg. Chrome accepts defaults to `text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*`
  // In this case `resolvedContentType` will result as: `text/html` due to the order given
  const resolvedContentType = accepts(req).types(SUPPORTED_TYPES);
  debug('Resolved content-type', resolvedContentType);
  let contentType = resolvedContentType || defaultType;

  if (options.negotiateContentType === false) {
    if (SUPPORTED_TYPES.indexOf(options.defaultType) > -1) {
      debug('Forcing options.defaultType `%s`',
        options.defaultType);
      contentType = options.defaultType;
    } else {
      debug('contentType: `%s` is not supported, ' +
        'falling back to contentType: `%s`',
      options.defaultType, contentType);
    }
  }

  // to receive _format from user's url param to overide the content type
  // req.query (eg /api/Users/1?_format=json will overide content negotiation
  // https://github.com/strongloop/strong-remoting/blob/ac3093dcfbb787977ca0229b0f672703859e52e1/lib/http-context.js#L643-L645
  const query = req.query || {};
  if (query._format) {
    if (SUPPORTED_TYPES.indexOf(query._format) > -1) {
      contentType = query._format;
    } else {
      // format passed through query but not supported
      const msg = util.format('Response _format "%s" is not supported' +
        'used "%s" instead"', query._format, defaultType);
      logWarning(msg);
    }
  }

  debug('Content-negotiation: req.headers.accept: `%s` Resolved as: `%s`',
    req.headers.accept, contentType);
  return resolveOperation(contentType);
}

function resolveOperation(contentType) {
  switch (contentType) {
    case 'application/json':
    case 'json':
      return sendJson;
    case 'text/html':
    case 'html':
      return sendHtml;
    case 'text/xml':
    case 'xml':
      return sendXml;
  }
}
