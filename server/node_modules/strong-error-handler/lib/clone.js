// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: strong-error-handler
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';
module.exports = cloneAllProperties;

/**
 * clone the error properties to the data objects
 * [err.name,  err.message, err.stack] are not enumerable properties
 * @param data Object to be altered
 * @param err Error Object
 */
function cloneAllProperties(data, err) {
  data.name = err.name;
  data.message = err.message;
  for (const p in err) {
    if ((p in data)) continue;
    data[p] = err[p];
  }
  // stack is appended last to ensure order is the same for response
  data.stack = err.stack;
}
