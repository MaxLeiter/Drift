// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: strong-globalize
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0
'use strict';

var g = require('strong-globalize')();

function getUserName() {
  var userName = g.f('user: %s', process.env.USER);
  return userName;
}
exports.getUserName = getUserName;

function getHelpText() {
  return g.t('help.txt');
}
exports.getHelpText = getHelpText;
