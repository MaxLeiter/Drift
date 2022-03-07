// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: strong-error-handler
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const assetDir = path.resolve(__dirname, '../views');
const compiledTemplates = {
  // loading default template and stylesheet
  default: loadDefaultTemplates(),
};

module.exports = sendHtml;

function sendHtml(res, data, options) {
  const toRender = {options, data};
  // TODO: ability to call non-default template functions from options
  const body = compiledTemplates.default(toRender);
  sendResponse(res, body);
}

/**
 * Compile and cache the file with the `filename` key in options
 *
 * @param filepath (description)
 * @returns {Function} render function with signature fn(data);
 */
function compileTemplate(filepath) {
  const options = {cache: true, filename: filepath};
  const fileContent = fs.readFileSync(filepath, 'utf8');
  return ejs.compile(fileContent, options);
}

// loads and cache default error templates
function loadDefaultTemplates() {
  const defaultTemplate = path.resolve(assetDir, 'default-error.ejs');
  return compileTemplate(defaultTemplate);
}

function sendResponse(res, body) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(body);
}
