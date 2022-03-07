# strong-error-handler

This package is an error handler for use in both development (debug) and production environments.

In production mode, `strong-error-handler` omits details from error responses to prevent leaking sensitive information:

- For 5xx errors, the output contains only the status code and the status name from the HTTP specification.
- For 4xx errors, the output contains the full error message (`error.message`) and the contents of the `details`
  property (`error.details`) that `ValidationError` typically uses to provide machine-readable details
  about validation problems. It also includes `error.code` to allow a machine-readable error code to be passed
  through which could be used, for example, for translation.

In debug mode, `strong-error-handler` returns full error stack traces and internal details of any error objects to the client in the HTTP responses.

## Supported versions

This module adopts the [Module Long Term Support (LTS)](http://github.com/CloudNativeJS/ModuleLTS) policy, with the following End Of Life (EOL) dates:

| Version    | Status          | Published | EOL                  |
| ---------- | --------------- | --------- | -------------------- |
| 4.x        | Current         | Oct 2020  | Apr 2023 _(minimum)_ |
| 3.x        | Active LTS      | Jun 2018  | Dec 2022             |
| 2.x        | End-of-life     | Mar 2017  | Oct 2020             |

Learn more about our LTS plan in the [LoopBack documentation](http://loopback.io/doc/en/contrib/Long-term-support.html).

## Installation

```bash
$ npm install --save strong-error-handler
```

## Use

In an Express-based application:

```js
var express = require('express');
var errorHandler = require('strong-error-handler');

var app = express();
// setup your routes
// `options` are set to default values. For more info, see `options` below.
// app.use(errorHandler({ /* options, see below */ }));
app.use(errorHandler({
  debug: app.get('env') === 'development',
  log: true,
}));

app.listen(3000);
```

The module also exports `writeErrorToResponse`, a non-middleware flavor of the
error handler:

```js
const http = require('http');
const writeErrorToResponse = require('strong-error-handler')
  .writeErrorToResponse;
const errHandlingOptions = {debug: process.env.NODE_ENV === 'development'}

http
  .createServer((req, res) => {
    if (errShouldBeThrown) {
      writeErrorToResponse(
        new Error('something went wrong'),
        req,
        res,
        errHandlingOptions,
      );
    }
  })
  .listen(3000);
```

In LoopBack applications, add the following entry to `server/middleware.json`:

```json
{
  "final:after": {
    "strong-error-handler": {
      "params": {
         "debug": false,
         "log": true
       }
    }
  }
}
```

In general, `strong-error-handler` must be the last middleware function registered.

The above configuration will log errors to the server console, but not return stack traces in HTTP responses.
For details on configuration options, see below.

### Response format and content type

The `strong-error-handler` package supports JSON, HTML and XML responses:

- When the object is a standard Error object, it returns the string provided by the stack property in HTML/text
  responses.
- When the object is a non-Error object, it returns the result of `util.inspect` in HTML/text responses.
- For JSON responses, the result is an object with all enumerable properties from the object in the response.

The content type of the response depends on the request's `Accepts` header.

-  For Accepts header `json` or `application/json`, the response content type is JSON.
-  For Accepts header `html` or `text/html`, the response content type is HTML.
-  For Accepts header `xml` or `text/xml`, the response content type is XML.

*There are plans to support other formats such as Plain-text.*

## Options

| Option               | Type                      | Default   | Description                                                                                                                                                                                                                                                                                                                                               |
| -------------------- | ------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| debug                | Boolean&nbsp;&nbsp;&nbsp; | `false`   | If `true`, HTTP responses include all error properties, including sensitive data such as file paths, URLs and stack traces. See [Example output](#example) below.                                                                                                                                                                                         |
| log                  | Boolean                   | `true`    | If `true`, all errors are printed via `console.error`, including an array of fields (custom error properties) that are safe to include in response messages (both 4xx and 5xx). <br/> If `false`, sends only the error back in the response.                                                                                                              |
| safeFields           | [String]                  | `[]`      | Specifies property names on errors that are allowed to be passed through in 4xx and 5xx responses. See [Safe error fields](#safe-error-fields) below.                                                                                                                                                                                                     |
| defaultType          | String                    | `"json"`  | Specifies the default response content type to use when the client does not provide any Accepts header.                                                                                                                                                                                                                                                   |
| rootProperty         | String or false           | `"error"` | Specifies the root property name for json or xml. If the value is set to `false`, no wrapper will be added to the json object. The false value is ignored by XML as a root element is always required.                                                                                                                                                    |
| negotiateContentType | Boolean                   | true      | Negotiate the response content type via Accepts request header. When disabled, strong-error-handler will always use the default content type when producing responses. Disabling content type negotiation is useful if you want to see JSON-formatted error responses in browsers, because browsers usually prefer HTML and XML over other content types. |

### Customizing log format

**Express**

To use a different log format, add your own custom error-handling middleware then disable `errorHandler.log`.
For example, in an Express application:

```js
app.use(myErrorLogger());
app.use(errorHandler({log: false}));
```

In general, add `strong-error-handler` as the last middleware function, just before calling `app.listen()`.

**LoopBack**

For LoopBack applications, put custom error-logging middleware in a separate file; for example, `server/middleware/error-logger.js`:

```
module.exports = function(options) {
  return function logError(err, req, res, next) {
    console.log('unhandled error' ,err);
    next(err);
  };
};
```

Then in `server/middleware.json`, specify your custom error logging function as follows:

```
{
  // ...
  "final:after": {
    "./middleware/error-logger": {},
    "strong-error-handler": {
      "params": {
        "log": false
      }
    }
}
```

The default `middleware.development.json` file explicitly enables logging in strong-error-handler params, so you will need to change that file too.

### Safe error fields

By default, `strong-error-handler` will only pass through the `name`, `message` and `details` properties of an error. Additional error
properties may be allowed through on 4xx and 5xx status code errors using the `safeFields` option to pass in an array of safe field names:

```
{
  "final:after": {
    "strong-error-handler": {
      "params": {
        "safeFields": ["errorCode"]
      }
    }
}
```

Using the above configuration, an error containing an `errorCode` property will produce the following response:

```
{
  "error": {
    "statusCode": 500,
    "message": "Internal Server Error",
    "errorCode": "INTERNAL_SERVER_ERROR"
  }
}
```

## Migration from old LoopBack error handler

NOTE: This is only required for applications scaffolded with old versions of the `slc loopback` tool.

To migrate a LoopBack 2.x application to use `strong-error-handler`:

1. In `package.json` dependencies, remove `"errorhandler": "^x.x.x”,`
1. Install the new error handler by entering the command:
    <pre>npm install --save strong-error-handler</pre>
1. In `server/config.json`, remove:
    <pre>
    "remoting": {
      ...
      "errorHandler": {
        "disableStackTrace": false
      }</pre>
    and replace it with:
    <pre>
    "remoting": {
      ...,
      "rest": {
        "handleErrors": false
      }</pre>
1. In `server/middleware.json`, remove:
    <pre>
    "final:after": {
      "loopback#errorHandler": {}
    }</pre>
    and replace it with:
    <pre>
    "final:after": {
      "strong-error-handler": {}
    }</pre>
1. Delete `server/middleware.production.json`.
1. Create `server/middleware.development.json` containing:
    <pre>
    "final:after": {
      "strong-error-handler": {
        "params": {
          "debug": true,
          "log": true
        }
      }
    }
</pre>

For more information, see
[Migrating apps to LoopBack 3.0](http://loopback.io/doc/en/lb3/Migrating-to-3.0.html#update-use-of-rest-error-handler).

## Example

5xx error generated when `debug: false` :

```
{ error: { statusCode: 500, message: 'Internal Server Error' } }
```

The same error generated when `debug: true` :

```
{ error:
  { statusCode: 500,
  name: 'Error',
  message: 'a test error message',
  stack: 'Error: a test error message
  at Context.<anonymous> (User/strong-error-handler/test/handler.test.js:220:21)
  at callFnAsync (User/strong-error-handler/node_modules/mocha/lib/runnable.js:349:8)
  at Test.Runnable.run (User/strong-error-handler/node_modules/mocha/lib/runnable.js:301:7)
  at Runner.runTest (User/strong-error-handler/node_modules/mocha/lib/runner.js:422:10)
  at User/strong-error-handler/node_modules/mocha/lib/runner.js:528:12
  at next (User/strong-error-handler/node_modules/mocha/lib/runner.js:342:14)
  at User/strong-error-handler/node_modules/mocha/lib/runner.js:352:7
  at next (User/strong-error-handler/node_modules/mocha/lib/runner.js:284:14)
  at Immediate._onImmediate (User/strong-error-handler/node_modules/mocha/lib/runner.js:320:5)
  at tryOnImmediate (timers.js:543:15)
  at processImmediate [as _immediateCallback] (timers.js:523:5)' }}
```

4xx error generated when `debug: false` :

```
{ error:
  { statusCode: 422,
  name: 'Unprocessable Entity',
  message: 'Missing required fields',
  code: 'MISSING_REQUIRED_FIELDS' }}
```
