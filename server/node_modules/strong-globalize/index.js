// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// Node module: strong-globalize
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

'use strict';

const StrongGlobalize = require('./lib/index');

const util = require('util');

/**
 * A facade constructor for `StrongGlobalize`. It allows both
 * `const g = new SG(...)` and `const g = SG(...)` for backward compatibility.
 *
 * @param {*} args Constructor arguments for `StrongGlobalize`
 */
function SG(...args) {
  if (!(this instanceof SG)) {
    return new SG(...args);
  }
  return new StrongGlobalize(...args);
}

Object.setPrototypeOf(SG, StrongGlobalize);
util.inherits(SG, StrongGlobalize);

// Expose the original `StrongGlobalize` class
SG.StrongGlobalize = StrongGlobalize;

module.exports = SG;
