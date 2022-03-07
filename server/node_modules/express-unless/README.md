Conditionally skip a middleware when a condition is met.

## Install

	npm i express-unless --save

## Usage

With existing middlewares:

```javascript
var unless = require('express-unless');


var static = express.static(__dirname + '/public');
static.unless = unless;

app.use(static.unless({ method: 'OPTIONS' }));
```

If you are authoring a middleware you can support unless as follow:

```javascript
module.exports = function (middlewareOptions) {
  var mymid = function (req, res, next) {

  };

  mymid.unless = require('express-unless');

  return mymid;
};
```

## Current options

-  `method` it could be an string or an array of strings. If the request method match the middleware will not run.
-  `path` it could be an string, a regexp or an array of any of those. It also could be an array of object which is url and methods key-pairs. If the request path or path and method match, the middleware will not run. Check [Examples](#examples) for usage.
-  `ext` it could be an string or an array of strings. If the request path ends with one of these extensions the middleware will not run.
-  `custom` it must be a function that accepts `req` and returns `true` / `false`. If the function returns true for the given request, the middleware will not run.
-  `useOriginalUrl` it should be `true` or `false`, default is `true`. if false, `path` will match against `req.url` instead of `req.originalUrl`. Please refer to [Express API](http://expressjs.com/4x/api.html#request) for the difference between `req.url` and `req.originalUrl`.


## Examples

Require authentication for every request unless the path is index.html.

```javascript
app.use(requiresAuth.unless({
  path: [
    '/index.html',
    { url: '/', methods: ['GET', 'PUT']  }
  ]
}))
```

Avoid a fstat for request to routes doesnt end with a given extension.

```javascript
app.use(static.unless(function (req) {
  var ext = url.parse(req.originalUrl).pathname.substr(-4);
  return !~['.jpg', '.html', '.css', '.js'].indexOf(ext);
}));
```

## License

MIT 2014 - Jose Romaniello
