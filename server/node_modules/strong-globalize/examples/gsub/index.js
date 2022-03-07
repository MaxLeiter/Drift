// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// Node module: strong-globalize
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

'use strict';

var SG = require('strong-globalize');
SG.SetRootDir(__dirname);
var util = require('./lib/util');

exports.getHelpText = util.getHelpText;
exports.getUserName = util.getUserName;
