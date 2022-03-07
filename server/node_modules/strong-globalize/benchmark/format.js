// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// Node module: strong-globalize
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

'use strict';

var f = require('util').format;
const SG = require('../lib/index');
var g = new SG();
var helper = require('../lib/helper');
var md5 = require('md5');

// The data was gathered by running (some) unit-tests of LoopBack
var data = require('./data/loopback-sample-messages.json');
var size = data.length;

console.log('BASELINE');
var baseline = measure(function format(args) { f.apply(this, args); });
console.log('  %s calls of "util.format()" took %sms', size, baseline);

console.log('CASE 1 - no messages are loaded');
var duration = measure(localize);
console.log('  %s calls of "g.f()" took %sms', size, duration);

var ratio = Math.ceil(duration / baseline);
console.log('  g.f() is %sx slower than util.format', ratio);

console.log('CASE 2 - all messages are loaded');
SG.SetDefaultLanguage();
loadMessagesFromData();
duration = measure(localize);
console.log('  %s calls of "g.f()" took %sms', size, duration);

ratio = Math.ceil(duration / baseline);
console.log('  g.f() is %sx slower than util.format', ratio);

// --- HELPERS --- //

function measure(fn) {
  var start = process.hrtime();
  for (var run = 0; run < 5; run++) {
    data.forEach(function(args) {
      fn(args);
    });
  }
  var delta = process.hrtime(start);
  return delta[0] * 1e3 + delta[1] / 1e6;
}

function localize(args) {
  g.f.apply(g, args);
}

function loadMessagesFromData() {
  var messages = {};
  data.forEach(function(value) {
    var msg = value[0];
    var key = md5(msg);
    if (messages[key]) return;
    if (helper.percent(msg))
      msg = helper.mapPercent(msg);
    messages[key] = msg;
  });
  SG.STRONGLOOP_GLB.loadMessages({en: messages});
}
