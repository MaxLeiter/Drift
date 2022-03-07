var unless = require('..');
var assert = require('chai').assert;
var noop = function(){};

function testMiddleware (req, res, next) {
  req.called = true;
  next();
}

testMiddleware.unless = unless;

describe('express-unless', function () {

  describe('with PATH and method exception', function () {
    var mid = testMiddleware.unless({
      path: [
        {
          url: '/test',
          methods: ['POST', 'GET']
        },
        {
          url: '/bar',
          method: 'PUT'
        },
        '/foo'
      ]
    });

    it('should not call the middleware when path and method match', function () {
      var req = {
        originalUrl: '/test?das=123',
        method: 'POST'
      };

      mid(req, {}, noop);
      assert.notOk(req.called);


      req = {
        originalUrl: '/test?test=123',
        method: 'GET'
      };

      mid(req, {}, noop);
      assert.notOk(req.called);

      req = {
        originalUrl: '/bar?test=123',
        method: 'PUT'
      };

      mid(req, {}, noop);
      assert.notOk(req.called);

      req = {
        originalUrl: '/foo',
        method: 'PUT'
      };

      mid(req, {}, noop);
      assert.notOk(req.called);
    });
    it('should call the middleware when path or method mismatch', function () {
      var req = {
        originalUrl: '/test?test=123',
        method: 'PUT'
      };

      mid(req, {}, noop);
      assert.ok(req.called);

      req = {
        originalUrl: '/bar?test=123',
        method: 'GET'
      };

      mid(req, {}, noop);
      assert.ok(req.called);

      req = {
        originalUrl: '/unless?test=123',
        method: 'PUT'
      };

      mid(req, {}, noop);
      assert.ok(req.called);
    });
  });

  describe('with PATH exception', function () {
    var mid = testMiddleware.unless({
      path: ['/test', '/fobo']
    });

    it('should not call the middleware when one of the path match', function () {
      var req = {
        originalUrl: '/test?das=123'
      };

      mid(req, {}, noop);

      assert.notOk(req.called);

      req = {
        originalUrl: '/fobo?test=123'
      };

      mid(req, {}, noop);

      assert.notOk(req.called);
    });

    it('should call the middleware when the path doesnt match', function () {
      var req = {
        originalUrl: '/foobar/test=123'
      };

      mid(req, {}, noop);

      assert.ok(req.called);
    });
  });

  describe('with PATH (regex) exception', function () {
    var mid = testMiddleware.unless({
      path: ['/test', /ag$/ig]
    });

    it('should not call the middleware when the regex match', function () {
      var req = {
        originalUrl: '/foboag?test=123'
      };

      var req2 = {
        originalUrl: '/foboag?test=456'
      };

      mid(req, {}, noop);
      mid(req2, {}, noop);

      assert.notOk(req.called);
      assert.notOk(req2.called);
    });

  });

  describe('with PATH (useOriginalUrl) exception', function () {
    var mid = testMiddleware.unless({
      path: ['/test', '/fobo'],
      useOriginalUrl: false
    });

    it('should not call the middleware when one of the path match '+
        'req.url instead of req.originalUrl', function () {
      var req = {
        originalUrl: '/orig/test?das=123',
        url: '/test?das=123'
      };

      mid(req, {}, noop);

      assert.notOk(req.called);

      req = {
        originalUrl: '/orig/fobo?test=123',
        url: '/fobo?test=123'
      };

      mid(req, {}, noop);

      assert.notOk(req.called);
    });

    it('should call the middleware when the path doesnt match '+
        'req.url even if path matches req.originalUrl', function () {
      var req = {
        originalUrl: '/test/test=123',
        url: '/foobar/test=123'
      };

      mid(req, {}, noop);

      assert.ok(req.called);
    });
  });

  describe('with EXT exception', function () {
    var mid = testMiddleware.unless({
      ext: ['jpg', 'html', 'txt']
    });

    it('should not call the middleware when the ext match', function () {
      var req = {
        originalUrl: '/foo.html?das=123'
      };

      mid(req, {}, noop);

      assert.notOk(req.called);
    });

    it('should call the middleware when the ext doesnt match', function () {
      var req = {
        originalUrl: '/foobar/test=123'
      };

      mid(req, {}, noop);

      assert.ok(req.called);
    });
  });

  describe('with METHOD exception', function () {
    var mid = testMiddleware.unless({
      method: ['OPTIONS', 'DELETE']
    });

    it('should not call the middleware when the method match', function () {
      var req = {
        originalUrl: '/foo.html?das=123',
        method: 'OPTIONS'
      };

      mid(req, {}, noop);

      assert.notOk(req.called);
    });

    it('should call the middleware when the method doesnt match', function () {
      var req = {
        originalUrl: '/foobar/test=123',
        method: 'PUT'
      };

      mid(req, {}, noop);

      assert.ok(req.called);
    });
  });

  describe('with custom exception', function () {
    var mid = testMiddleware.unless({
      custom: function (req) {
        return req.baba;
      }
    });

    it('should not call the middleware when the custom rule match', function () {
      var req = {
        baba: true
      };

      mid(req, {}, noop);

      assert.notOk(req.called);
    });

    it('should call the middleware when the custom rule doesnt match', function (done) {
      var req = {
        baba: false
      };

      mid(req, {}, () => {
        assert.ok(req.called);
        done();
      });
    });
  });

  describe('with async custom exception', function () {
    var mid = testMiddleware.unless({
      custom: async function (req) {
        return req.baba;
      }
    });

    it('should not call the middleware when the async custom rule match', function (done) {
      var req = {
        baba: true
      };

      mid(req, {}, () => {
        assert.notOk(req.called);
        done();
      });
    });

    it('should call the middleware when the async custom rule doesnt match', function (done) {
      var req = {
        baba: false
      };

      mid(req, {}, () => {
        assert.ok(req.called);
        done();
      });


    });
  });

  describe('without originalUrl', function () {
    var mid = testMiddleware.unless({
      path: ['/test']
    });

    it('should not call the middleware when one of the path match', function () {
      var req = {
        url: '/test?das=123'
      };

      mid(req, {}, noop);

      assert.notOk(req.called);
    });

    it('should call the middleware when the path doesnt match', function () {
      var req = {
        url: '/foobar/test=123'
      };

      mid(req, {}, noop);

      assert.ok(req.called);
    });
  });

  describe('chaining', function () {
    var mid = testMiddleware
                .unless({ path: '/test' })
                .unless({ method: 'GET' });

    it('should not call the middleware when first unless match', function () {
      var req = {
        url: '/test'
      };

      mid(req, {}, noop);

      assert.notOk(req.called);
    });

    it('should not call the middleware when second unless match', function () {
      var req = {
        url: '/safsa',
        method: 'GET'
      };

      mid(req, {}, noop);

      assert.notOk(req.called);
    });

    it('should call the middleware when none of the conditions are met', function () {
      var req = {
        url: '/foobar/test=123'
      };

      mid(req, {}, noop);

      assert.ok(req.called);
    });
  });

});
