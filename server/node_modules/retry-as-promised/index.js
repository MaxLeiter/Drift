'use strict';

var util = require('util');
var format = util.format;

function TimeoutError(message, err) {
  Error.call(this);
  Error.captureStackTrace(this, TimeoutError);
  this.name = 'TimeoutError';
  this.message = message;
  this.previous = err;
}

util.inherits(TimeoutError, Error);

function matches(match, err) {
  if (match === true) return true;
  if (typeof match === 'function') {
    try {
      if (err instanceof match) return true;
    } catch (_) {
      return !!match(err);
    }
  }
  if (match === err.toString()) return true;
  if (match === err.message) return true;
  return match instanceof RegExp
    && (match.test(err.message) || match.test(err.toString()));
}

module.exports = function retryAsPromised(callback, options) {
  if (!callback || !options) {
    throw new Error(
      'retry-as-promised must be passed a callback and a options set or a number'
    );
  }

  if (typeof options === 'number') {
    options = {
      max: options
    };
  }

  // Super cheap clone
  options = {
    $current: options.$current || 1,
    max: options.max,
    timeout: options.timeout || undefined,
    match: options.match || [],
    backoffBase: options.backoffBase === undefined ? 100 : options.backoffBase,
    backoffExponent: options.backoffExponent || 1.1,
    report: options.report || function () {},
    name: options.name || callback.name || 'unknown'
  };

  if (!Array.isArray(options.match)) options.match = [options.match];
  options.report('Trying ' + options.name + ' #' + options.$current + ' at ' + new Date().toLocaleTimeString(), options);

  return new Promise(function(resolve, reject) {
    var timeout, backoffTimeout, lastError;

    if (options.timeout) {
      timeout = setTimeout(function() {
        if (backoffTimeout) clearTimeout(backoffTimeout);
        reject(new TimeoutError(options.name + ' timed out', lastError));
      }, options.timeout);
    }

    Promise.resolve(callback({ current: options.$current }))
      .then(resolve)
      .then(function() {
        if (timeout) clearTimeout(timeout);
        if (backoffTimeout) clearTimeout(backoffTimeout);
      })
      .catch(function(err) {
        if (timeout) clearTimeout(timeout);
        if (backoffTimeout) clearTimeout(backoffTimeout);

        lastError = err;
        options.report((err && err.toString()) || err, options);

        // Should not retry if max has been reached
        var shouldRetry = options.$current < options.max;
        if (!shouldRetry) return reject(err);
        shouldRetry = options.match.length === 0 || options.match.some(function (match) {
          return matches(match, err)
        });
        if (!shouldRetry) return reject(err);

        var retryDelay = options.backoffBase * Math.pow(options.backoffExponent, options.$current - 1);

        // Do some accounting
        options.$current++;
        options.report(format('Retrying %s (%s)', options.name, options.$current), options);

        if (retryDelay) {
          // Use backoff function to ease retry rate
          options.report(format('Delaying retry of %s by %s', options.name, retryDelay), options);
          backoffTimeout = setTimeout(function() {
            retryAsPromised(callback, options)
              .then(resolve)
              .catch(reject);
          }, retryDelay);
        } else {
          retryAsPromised(callback, options)
            .then(resolve)
            .catch(reject);
        }
      });
  });
};

module.exports.TimeoutError = TimeoutError;
