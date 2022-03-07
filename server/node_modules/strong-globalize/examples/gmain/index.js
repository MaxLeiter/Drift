// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// Node module: strong-globalize
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

'use strict';

var SG = require('strong-globalize');
SG.SetRootDir(__dirname, {autonomousMsgLoading: 'all'});
SG.SetDefaultLanguage();
var g = new SG();

var express = require('express');
var gsub = require('gsub');
var request = require('request');
var util = require('util');

var app = express();

app.get('/', function(req, res) {
  var helloMessage = util.format('%s Hello %s',
    g.d(new Date()), gsub.getUserName());
  res.end(helloMessage);
});

var amount = 1000;
var currency = g.c(amount, 'JPY');
var port = 8080;
app.listen(port, function() {
  g.log('Listening on %d by %s.', port, gsub.getUserName());
  g.log(gsub.getHelpText());
  g.log('Shipping cost is %s.', currency);
});

setInterval(function() {
  request('http://localhost:' + port,
    function(_error, response, body) { console.log(body); });
}, 1000);
