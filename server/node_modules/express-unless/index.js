var URL = require('url');

function unless(middleware, options) {
  if (typeof options === 'undefined') {
    options = middleware;
    middleware = this;
  }

  var opts = typeof options === 'function' ? {custom: options} : options;
  opts.useOriginalUrl = (typeof opts.useOriginalUrl === 'undefined') ? true : opts.useOriginalUrl;

  const result = async function (req, res, next) {
    var url = URL.parse((opts.useOriginalUrl ? req.originalUrl : req.url) || req.url || '', true);

    var skip = false;

    if (opts.custom) {
      skip = skip || (await opts.custom(req));
    }

    var paths = oneOrMany(opts.path);

    if (paths) {
      skip = skip || paths.some(function (p) {
        var methods = p.methods || oneOrMany(p.method);
        return isUrlMatch(p, url.pathname) && isMethodMatch(methods, req.method);
      });
    }

    var exts = (!opts.ext || Array.isArray(opts.ext)) ?
               opts.ext : [opts.ext];

    if (exts) {
      skip = skip || exts.some(function (ext) {
        return url.pathname.substr(ext.length * -1) === ext;
      });
    }

    var methods = oneOrMany(opts.method);

    if (methods) {
      skip = skip || methods.indexOf(req.method) > -1;
    }

    if (skip) {
      return next();
    }

    middleware(req, res, next);
  };

  result.unless = unless;

  return result;
}

function oneOrMany(elementOrArray) {
  return !elementOrArray || Array.isArray(elementOrArray) ?
    elementOrArray : [elementOrArray];
}

function isUrlMatch(p, url) {
  var ret = (typeof p === 'string' && p === url) || (p instanceof RegExp && !!p.exec(url));
  if (p instanceof RegExp) {
    p.lastIndex = 0;
  }

  if (p && p.url) {
    ret = isUrlMatch(p.url, url);
  }
  return ret;
}

function isMethodMatch(methods, m) {
  if (!methods) {
    return true;
  }

  methods = oneOrMany(methods);

  return methods.indexOf(m) > -1;
}

module.exports = unless;
