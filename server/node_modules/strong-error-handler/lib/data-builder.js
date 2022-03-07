// Copyright IBM Corp. 2016,2018. All Rights Reserved.
// Node module: strong-error-handler
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

const cloneAllProperties = require('../lib/clone.js');
const httpStatus = require('http-status');

module.exports = buildResponseData;

function buildResponseData(err, options) {
  // Debugging mode is disabled by default. When turned on (in dev),
  // all error properties (including) stack traces are sent in the response
  const isDebugMode = options.debug;

  if (Array.isArray(err)) {
    return serializeArrayOfErrors(err, options);
  }

  const data = Object.create(null);
  fillStatusCode(data, err);

  if (typeof err !== 'object') {
    err = {
      statusCode: 500,
      message: '' + err,
    };
  }

  if (isDebugMode) {
    fillDebugData(data, err);
    return data;
  }

  if (data.statusCode >= 400 && data.statusCode <= 499) {
    fillBadRequestError(data, err);
  } else {
    fillInternalError(data, err);
  }

  const safeFields = options.safeFields || [];
  fillSafeFields(data, err, safeFields);

  return data;
}

function serializeArrayOfErrors(errors, options) {
  const details = errors.map(e => buildResponseData(e, options));
  return {
    statusCode: 500,
    message: 'Failed with multiple errors, ' +
      'see `details` for more information.',
    details: details,
  };
}

function fillStatusCode(data, err) {
  data.statusCode = err.statusCode || err.status;
  if (!data.statusCode || data.statusCode < 400)
    data.statusCode = 500;
}

function fillDebugData(data, err) {
  cloneAllProperties(data, err);
}

function fillBadRequestError(data, err) {
  data.name = err.name;
  data.message = err.message;
  data.code = err.code;
  data.details = err.details;
}

function fillInternalError(data, err) {
  data.message = httpStatus[data.statusCode] || 'Unknown Error';
}

function fillSafeFields(data, err, safeFields) {
  if (!Array.isArray(safeFields)) {
    safeFields = [safeFields];
  }

  safeFields.forEach(function(field) {
    if (err[field] !== undefined) {
      data[field] = err[field];
    }
  });
}
