// Copyright IBM Corp. 2016,2018. All Rights Reserved.
// Node module: strong-error-handler
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

const cloneAllProperties = require('../lib/clone.js');
const debug = require('debug')('test');
const expect = require('chai').expect;
const express = require('express');
const strongErrorHandler = require('..');
const supertest = require('supertest');
const util = require('util');

describe('strong-error-handler', function() {
  before(setupHttpServerAndClient);
  beforeEach(resetRequestHandler);
  after(stopHttpServerAndClient);

  it('sets nosniff header', function(done) {
    givenErrorHandlerForError();
    request.get('/')
      .expect('X-Content-Type-Options', 'nosniff')
      .expect(500, done);
  });

  it('handles response headers already sent', function(done) {
    givenErrorHandlerForError();
    const handler = _requestHandler;
    _requestHandler = function(req, res, next) {
      res.end('empty');
      process.nextTick(function() {
        handler(req, res, next);
      });
    };

    request.get('/').expect(200, 'empty', done);
  });

  context('status code', function() {
    it('converts non-error "err.status" to 500', function(done) {
      givenErrorHandlerForError(new ErrorWithProps({status: 200}));
      request.get('/').expect(500, done);
    });

    it('converts non-error "err.statusCode" to 500', function(done) {
      givenErrorHandlerForError(new ErrorWithProps({statusCode: 200}));
      request.get('/').expect(500, done);
    });

    it('uses the value from "err.status"', function(done) {
      givenErrorHandlerForError(new ErrorWithProps({status: 404}));
      request.get('/').expect(404, done);
    });

    it('uses the value from "err.statusCode"', function(done) {
      givenErrorHandlerForError(new ErrorWithProps({statusCode: 404}));
      request.get('/').expect(404, done);
    });

    it('prefers "err.statusCode" over "err.status"', function(done) {
      givenErrorHandlerForError(new ErrorWithProps({
        statusCode: 400,
        status: 404,
      }));

      request.get('/').expect(400, done);
    });

    it('handles error from `res.statusCode`', function(done) {
      givenErrorHandlerForError();
      const handler = _requestHandler;
      _requestHandler = function(req, res, next) {
        res.statusCode = 507;
        handler(req, res, next);
      };
      request.get('/').expect(
        507,
        {error: {statusCode: 507, message: 'Insufficient Storage'}},
        done,
      );
    });
  });

  context('logging', function() {
    let logs;

    beforeEach(redirectConsoleError);
    afterEach(restoreConsoleError);

    it('logs by default', function(done) {
      givenErrorHandlerForError(new Error(), {
        // explicitly set to undefined to prevent givenErrorHandlerForError
        // from disabling this option
        log: undefined,
      });

      request.get('/').end(function(err) {
        if (err) return done(err);
        expect(logs).to.have.length(1);
        done();
      });
    });

    it('honours options.log=false', function(done) {
      givenErrorHandlerForError(new Error(), {log: false});

      request.get('/api').end(function(err) {
        if (err) return done(err);
        expect(logs).to.have.length(0);
        done();
      });
    });

    it('honours options.log=true', function(done) {
      givenErrorHandlerForError(new Error(), {log: true});

      request.get('/api').end(function(err) {
        if (err) return done(err);
        expect(logs).to.have.length(1);
        done();
      });
    });

    it('includes relevant information in the log message', function(done) {
      givenErrorHandlerForError(new TypeError('ERROR-NAME'), {log: true});

      request.get('/api').end(function(err) {
        if (err) return done(err);

        const msg = logs[0];
        // the request method
        expect(msg).to.contain('GET');
        // the request path
        expect(msg).to.contain('/api');
        // the error name & message
        expect(msg).to.contain('TypeError: ERROR-NAME');
        // the stack
        expect(msg).to.contain(__filename);

        done();
      });
    });

    it('handles array argument', function(done) {
      givenErrorHandlerForError(
        [new TypeError('ERR1'), new Error('ERR2')],
        {log: true},
      );

      request.get('/api').end(function(err) {
        if (err) return done(err);

        const msg = logs[0];
        // the request method
        expect(msg).to.contain('GET');
        // the request path
        expect(msg).to.contain('/api');
        // the error name & message for all errors
        expect(msg).to.contain('TypeError: ERR1');
        expect(msg).to.contain('Error: ERR2');
        // verify that stacks are included too
        expect(msg).to.contain(__filename);

        done();
      });
    });

    it('handles non-Error argument', function(done) {
      givenErrorHandlerForError('STRING ERROR', {log: true});
      request.get('/').end(function(err) {
        if (err) return done(err);
        const msg = logs[0];
        expect(msg).to.contain('STRING ERROR');
        done();
      });
    });

    const _consoleError = console.error;
    function redirectConsoleError() {
      logs = [];
      console.error = function() {
        const msg = util.format.apply(util, arguments);
        logs.push(msg);
      };
    }

    function restoreConsoleError() {
      console.error = _consoleError;
      logs = [];
    }
  });

  context('JSON response', function() {
    it('contains all error properties when debug=true', function(done) {
      const error = new ErrorWithProps({
        message: 'a test error message',
        code: 'MACHINE_READABLE_CODE',
        details: 'some details',
        extra: 'sensitive data',
      });
      givenErrorHandlerForError(error, {debug: true});

      requestJson().end(function(err, res) {
        if (err) return done(err);

        const expectedData = {
          statusCode: 500,
          message: 'a test error message',
          name: 'ErrorWithProps',
          code: 'MACHINE_READABLE_CODE',
          details: 'some details',
          extra: 'sensitive data',
          stack: error.stack,
        };
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.eql(expectedData);
        done();
      });
    });

    it('includes code property for 4xx status codes when debug=false',
      function(done) {
        const error = new ErrorWithProps({
          statusCode: 400,
          message: 'error with code',
          name: 'ErrorWithCode',
          code: 'MACHINE_READABLE_CODE',
        });
        givenErrorHandlerForError(error, {debug: false});

        requestJson().end(function(err, res) {
          if (err) return done(err);

          const expectedData = {
            statusCode: 400,
            message: 'error with code',
            name: 'ErrorWithCode',
            code: 'MACHINE_READABLE_CODE',
          };
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.eql(expectedData);
          done();
        });
      });

    it('excludes code property for 5xx status codes when debug=false',
      function(done) {
        const error = new ErrorWithProps({
          statusCode: 500,
          code: 'MACHINE_READABLE_CODE',
        });
        givenErrorHandlerForError(error, {debug: false});

        requestJson().end(function(err, res) {
          if (err) return done(err);

          const expectedData = {
            statusCode: 500,
            message: 'Internal Server Error',
          };
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.eql(expectedData);
          done();
        });
      });

    it('contains non-enumerable Error properties when debug=true',
      function(done) {
        const error = new Error('a test error message');
        givenErrorHandlerForError(error, {debug: true});
        requestJson().end(function(err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('error');
          const resError = res.body.error;
          expect(resError).to.have.property('name', 'Error');
          expect(resError).to.have.property('message',
            'a test error message');
          expect(resError).to.have.property('stack', error.stack);
          done();
        });
      });

    it('should allow setting safe fields when status=5xx', function(done) {
      const error = new ErrorWithProps({
        name: 'Error',
        safeField: 'SAFE',
        unsafeField: 'UNSAFE',
      });
      givenErrorHandlerForError(error, {
        safeFields: ['safeField'],
      });

      requestJson().end(function(err, res) {
        if (err) return done(err);

        expect(res.body).to.have.property('error');
        expect(res.body.error).to.have.property('safeField', 'SAFE');
        expect(res.body.error).not.to.have.property('unsafeField');

        done();
      });
    });

    it('safe fields falls back to existing data', function(done) {
      const error = new ErrorWithProps({
        name: 'Error',
        isSafe: false,
      });
      givenErrorHandlerForError(error, {
        safeFields: ['statusCode', 'isSafe'],
      });

      requestJson().end(function(err, res) {
        if (err) return done(err);
        expect(res.body.error.statusCode).to.equal(500);
        expect(res.body.error.isSafe).to.equal(false);

        done();
      });
    });

    it('should allow setting safe fields when status=4xx', function(done) {
      const error = new ErrorWithProps({
        name: 'Error',
        statusCode: 422,
        safeField: 'SAFE',
        unsafeField: 'UNSAFE',
      });
      givenErrorHandlerForError(error, {
        safeFields: ['safeField'],
      });

      requestJson().end(function(err, res) {
        if (err) return done(err);

        expect(res.body).to.have.property('error');
        expect(res.body.error).to.have.property('safeField', 'SAFE');
        expect(res.body.error).not.to.have.property('unsafeField');

        done();
      });
    });

    it('contains subset of properties when status=4xx', function(done) {
      const error = new ErrorWithProps({
        name: 'ValidationError',
        message: 'The model instance is not valid.',
        statusCode: 422,
        details: 'some details',
        extra: 'sensitive data',
      });
      givenErrorHandlerForError(error);

      requestJson().end(function(err, res) {
        if (err) return done(err);

        expect(res.body).to.have.property('error');
        expect(res.body.error).to.eql({
          name: 'ValidationError',
          message: 'The model instance is not valid.',
          statusCode: 422,
          details: 'some details',
          // notice the property "extra" is not included
        });
        done();
      });
    });

    it('contains only safe info when status=5xx', function(done) {
      // Mock an error reported by fs.readFile
      const error = new ErrorWithProps({
        name: 'Error',
        message: 'ENOENT: no such file or directory, open "/etc/passwd"',
        errno: -2,
        code: 'ENOENT',
        syscall: 'open',
        path: '/etc/password',
      });
      givenErrorHandlerForError(error);

      requestJson().end(function(err, res) {
        if (err) return done(err);

        expect(res.body).to.have.property('error');
        expect(res.body.error).to.eql({
          statusCode: 500,
          message: 'Internal Server Error',
        });

        done();
      });
    });

    it('handles array argument as 500 when debug=false', function(done) {
      const errors = [new Error('ERR1'), new Error('ERR2'), 'ERR STRING'];
      givenErrorHandlerForError(errors);

      requestJson().expect(500).end(function(err, res) {
        if (err) return done(err);
        const data = res.body.error;
        expect(data).to.have.property('message').that.match(/multiple errors/);
        expect(data).to.have.property('details').eql([
          {statusCode: 500, message: 'Internal Server Error'},
          {statusCode: 500, message: 'Internal Server Error'},
          {statusCode: 500, message: 'Internal Server Error'},
        ]);
        done();
      });
    });

    it('returns all array items when debug=true', function(done) {
      const testError = new ErrorWithProps({
        message: 'expected test error',
        statusCode: 400,
      });
      const anotherError = new ErrorWithProps({
        message: 'another expected error',
        statusCode: 500,
      });
      const errors = [testError, anotherError, 'ERR STRING'];
      givenErrorHandlerForError(errors, {debug: true});

      requestJson().expect(500).end(function(err, res) {
        if (err) return done(err);

        const data = res.body.error;
        expect(data).to.have.property('message').that.match(/multiple errors/);

        const expectedDetails = [
          getExpectedErrorData(testError),
          getExpectedErrorData(anotherError),
          {message: 'ERR STRING', statusCode: 500},
        ];
        expect(data).to.have.property('details').to.eql(expectedDetails);
        done();
      });
    });

    it('includes safeFields of array items when debug=false', (done) => {
      const internalError = new ErrorWithProps({
        message: 'a test error message',
        code: 'MACHINE_READABLE_CODE',
        details: 'some details',
        extra: 'sensitive data',
      });
      const validationError = new ErrorWithProps({
        name: 'ValidationError',
        message: 'The model instance is not valid.',
        statusCode: 422,
        code: 'VALIDATION_ERROR',
        details: 'some details',
        extra: 'sensitive data',
      });

      const errors = [internalError, validationError, 'ERR STRING'];
      givenErrorHandlerForError(errors, {
        debug: false,
        safeFields: ['code'],
      });

      requestJson().end(function(err, res) {
        if (err) return done(err);
        const data = res.body.error;

        const expectedInternalError = {
          statusCode: 500,
          message: 'Internal Server Error',
          code: 'MACHINE_READABLE_CODE',
          // notice the property "extra" is not included
        };
        const expectedValidationError = {
          statusCode: 422,
          message: 'The model instance is not valid.',
          name: 'ValidationError',
          code: 'VALIDATION_ERROR',
          details: 'some details',
          // notice the property "extra" is not included
        };
        const expectedErrorFromString = {
          message: 'Internal Server Error',
          statusCode: 500,
        };
        const expectedDetails = [
          expectedInternalError,
          expectedValidationError,
          expectedErrorFromString,
        ];

        expect(data).to.have.property('message').that.match(/multiple errors/);
        expect(data).to.have.property('details').to.eql(expectedDetails);
        done();
      });
    });

    it('handles non-Error argument as 500 when debug=false', function(done) {
      givenErrorHandlerForError('Error Message', {debug: false});
      requestJson().expect(500).end(function(err, res) {
        if (err) return done(err);

        expect(res.body.error).to.eql({
          statusCode: 500,
          message: 'Internal Server Error',
        });
        done();
      });
    });

    it('returns non-Error argument in message when debug=true', function(done) {
      givenErrorHandlerForError('Error Message', {debug: true});
      requestJson().expect(500).end(function(err, res) {
        if (err) return done(err);

        expect(res.body.error).to.eql({
          statusCode: 500,
          message: 'Error Message',
        });
        done();
      });
    });

    it('handles Error objects containing circular properties', function(done) {
      const circularObject = {};
      circularObject.recursiveProp = circularObject;
      const error = new ErrorWithProps({
        statusCode: 422,
        message: 'The model instance is not valid.',
        name: 'ValidationError',
        code: 'VALIDATION_ERROR',
        details: circularObject,
      });
      givenErrorHandlerForError(error, {debug: true});
      requestJson().end(function(err, res) {
        if (err) return done(err);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.have.property('details');
        expect(res.body.error.details).to.have.property('recursiveProp',
          '[Circular]');
        done();
      });
    });

    it('honors rootProperty', function(done) {
      givenErrorHandlerForError('Error Message', {rootProperty: 'data'});
      requestJson().expect(500).end(function(err, res) {
        if (err) return done(err);

        expect(res.body.data).to.eql({
          statusCode: 500,
          message: 'Internal Server Error',
        });
        done();
      });
    });

    it('honors rootProperty=false', function(done) {
      givenErrorHandlerForError('Error Message', {rootProperty: false});
      requestJson().expect(500).end(function(err, res) {
        if (err) return done(err);

        expect(res.body).to.eql({
          statusCode: 500,
          message: 'Internal Server Error',
        });
        done();
      });
    });

    function requestJson(url) {
      return request.get(url || '/')
        .set('Accept', 'text/plain')
        .expect('Content-Type', /^application\/json/);
    }
  });

  context('HTML response', function() {
    it('contains all error properties when debug=true', function(done) {
      const error = new ErrorWithProps({
        message: 'a test error message',
        details: 'some details',
        extra: 'sensitive data',
      });
      error.statusCode = 500;
      givenErrorHandlerForError(error, {debug: true});
      requestHTML()
        .expect(500)
        .expect(/<title>ErrorWithProps<\/title>/)
        .expect(/500(.*?)a test error message/)
        .expect(/extra(.*?)sensitive data/)
        .expect(/details(.*?)some details/)
        .expect(/id="stacktrace"(.*?)ErrorWithProps: a test error message/,
          done);
    });

    it('HTML-escapes all 4xx response properties in production mode',
      function(done) {
        const error = new ErrorWithProps({
          name: 'Error<img onerror=alert(1) src=a>',
          message:
            'No instance with id <img onerror=alert(1) src=a> found for Model',
          statusCode: 404,
        });
        givenErrorHandlerForError(error, {debug: false});
        requestHTML()
          .end(function(err, res) {
            expect(res.statusCode).to.eql(404);
            const body = res.error.text;
            expect(body).to.match(
              /<title>Error&lt;img onerror=alert\(1\) src=a&gt;<\/title>/,
            );
            expect(body).to.match(
              /with id &lt;img onerror=alert\(1\) src=a&gt; found for Model/,
            );
            done();
          });
      });

    it('HTML-escapes all 5xx response properties in development mode',
      function(done) {
        const error = new ErrorWithProps({
          message: 'a test error message<img onerror=alert(1) src=a>',
        });
        error.statusCode = 500;
        givenErrorHandlerForError(error, {debug: true});
        requestHTML()
          .expect(500)
          .expect(/<title>ErrorWithProps<\/title>/)
          .expect(
            /500(.*?)a test error message&lt;img onerror=alert\(1\) src=a&gt;/,
            done,
          );
      });

    it('contains subset of properties when status=4xx', function(done) {
      const error = new ErrorWithProps({
        name: 'ValidationError',
        message: 'The model instance is not valid.',
        statusCode: 422,
        details: 'some details',
        extra: 'sensitive data',
      });
      givenErrorHandlerForError(error, {debug: false});
      requestHTML()
        .end(function(err, res) {
          expect(res.statusCode).to.eql(422);
          const body = res.error.text;
          expect(body).to.match(/some details/);
          expect(body).to.not.match(/sensitive data/);
          expect(body).to.match(/<title>ValidationError<\/title>/);
          expect(body).to.match(/422(.*?)The model instance is not valid./);
          done();
        });
    });

    it('contains only safe info when status=5xx', function(done) {
      // Mock an error reported by fs.readFile
      const error = new ErrorWithProps({
        name: 'Error',
        message: 'ENOENT: no such file or directory, open "/etc/passwd"',
        errno: -2,
        code: 'ENOENT',
        syscall: 'open',
        path: '/etc/password',
      });
      givenErrorHandlerForError(error);

      requestHTML()
        .end(function(err, res) {
          expect(res.statusCode).to.eql(500);
          const body = res.error.text;
          expect(body).to.not.match(/\/etc\/password/);
          expect(body).to.not.match(/-2/);
          expect(body).to.not.match(/ENOENT/);
          // only have the following
          expect(body).to.match(/<title>Internal Server Error<\/title>/);
          expect(body).to.match(/500(.*?)Internal Server Error/);
          done();
        });
    });

    function requestHTML(url) {
      return request.get(url || '/')
        .set('Accept', 'text/html')
        .expect('Content-Type', /^text\/html/);
    }
  });

  context('XML response', function() {
    it('contains all error properties when debug=true', function(done) {
      const error = new ErrorWithProps({
        message: 'a test error message',
        details: 'some details',
        extra: 'sensitive data',
      });
      error.statusCode = 500;
      givenErrorHandlerForError(error, {debug: true});
      requestXML()
        .expect(500)
        .expect(/<statusCode>500<\/statusCode>/)
        .expect(/<name>ErrorWithProps<\/name>/)
        .expect(/<message>a test error message<\/message>/)
        .expect(/<details>some details<\/details>/)
        .expect(/<extra>sensitive data<\/extra>/)
        .expect(/<stack>ErrorWithProps: a test error message(.*?)/, done);
    });

    it('contains subset of properties when status=4xx', function(done) {
      const error = new ErrorWithProps({
        name: 'ValidationError',
        message: 'The model instance is not valid.',
        statusCode: 422,
        details: 'some details',
        extra: 'sensitive data',
      });
      givenErrorHandlerForError(error, {debug: false});
      requestXML()
        .end(function(err, res) {
          expect(res.statusCode).to.eql(422);
          const body = res.error.text;
          expect(body).to.match(/<details>some details<\/details>/);
          expect(body).to.not.match(/<extra>sensitive data<\/extra>/);
          expect(body).to.match(/<name>ValidationError<\/name>/);
          expect(body).to.match(
            /<message>The model instance is not valid.<\/message>/,
          );
          done();
        });
    });

    it('contains only safe info when status=5xx', function(done) {
      // Mock an error reported by fs.readFile
      const error = new ErrorWithProps({
        name: 'Error',
        message: 'ENOENT: no such file or directory, open "/etc/passwd"',
        errno: -2,
        code: 'ENOENT',
        syscall: 'open',
        path: '/etc/password',
      });
      givenErrorHandlerForError(error);

      requestXML()
        .end(function(err, res) {
          expect(res.statusCode).to.eql(500);
          const body = res.error.text;
          expect(body).to.not.match(/\/etc\/password/);
          expect(body).to.not.match(/-2/);
          expect(body).to.not.match(/ENOENT/);
          // only have the following
          expect(body).to.match(/<statusCode>500<\/statusCode>/);
          expect(body).to.match(/<message>Internal Server Error<\/message>/);
          done();
        });
    });

    it('honors options.rootProperty', function(done) {
      const error = new ErrorWithProps({
        name: 'ValidationError',
        message: 'The model instance is not valid.',
        statusCode: 422,
        details: 'some details',
        extra: 'sensitive data',
      });
      givenErrorHandlerForError(error, {rootProperty: 'myRoot'});
      requestXML()
        .end(function(err, res) {
          expect(res.statusCode).to.eql(422);
          const body = res.error.text;
          expect(body).to.match(/<myRoot>/);
          expect(body).to.match(/<details>some details<\/details>/);
          expect(body).to.not.match(/<extra>sensitive data<\/extra>/);
          expect(body).to.match(/<name>ValidationError<\/name>/);
          expect(body).to.match(
            /<message>The model instance is not valid.<\/message>/,
          );
          done();
        });
    });

    it('ignores options.rootProperty = false', function(done) {
      const error = new ErrorWithProps({
        name: 'ValidationError',
        message: 'The model instance is not valid.',
        statusCode: 422,
        details: 'some details',
        extra: 'sensitive data',
      });
      givenErrorHandlerForError(error, {rootProperty: false});
      requestXML()
        .end(function(err, res) {
          expect(res.statusCode).to.eql(422);
          const body = res.error.text;
          expect(body).to.match(/<error>/);
          expect(body).to.match(/<details>some details<\/details>/);
          expect(body).to.not.match(/<extra>sensitive data<\/extra>/);
          expect(body).to.match(/<name>ValidationError<\/name>/);
          expect(body).to.match(
            /<message>The model instance is not valid.<\/message>/,
          );
          done();
        });
    });

    function requestXML(url) {
      return request.get(url || '/')
        .set('Accept', 'text/xml')
        .expect('Content-Type', /^text\/xml/);
    }
  });

  context('Content Negotiation', function() {
    it('defaults to json without options', function(done) {
      givenErrorHandlerForError(new Error('Some error'), {});
      request.get('/')
        .set('Accept', '*/*')
        .expect('Content-Type', /^application\/json/, done);
    });

    it('honors accepted content-type', function(done) {
      givenErrorHandlerForError(new Error('Some error'), {
        defaultType: 'application/json',
      });
      request.get('/')
        .set('Accept', 'text/html')
        .expect('Content-Type', /^text\/html/, done);
    });

    it('honors order of accepted content-type', function(done) {
      givenErrorHandlerForError(new Error('Some error'), {
        defaultType: 'text/html',
      });
      request.get('/')
        // `application/json` will be used because its provided first
        .set('Accept', 'application/json, text/html')
        .expect('Content-Type', /^application\/json/, done);
    });

    it('disables content-type negotiation when negotiateContentType=false',
      function(done) {
        givenErrorHandlerForError(new Error('Some error'), {
          negotiateContentType: false,
          defaultType: 'application/json',
        });
        request.get('/')
          .set('Accept', 'text/html')
          .expect('Content-Type', /^application\/json/, done);
      });

    it('chooses resolved type when negotiateContentType=false + not-supported',
      function(done) {
        givenErrorHandlerForError(new Error('Some error'), {
          negotiateContentType: false,
          defaultType: 'unsupported/type',
        });
        request.get('/')
          .set('Accept', 'text/html')
          .expect('Content-Type', /^text\/html/, done);
      });

    it('chooses default type when negotiateContentType=false + not-supported ',
      function(done) {
        givenErrorHandlerForError(new Error('Some error'), {
          negotiateContentType: false,
          defaultType: 'unsupported/type',
        });
        request.get('/')
          .expect('Content-Type', /^application\/json/, done);
      });

    it('honors order of accepted content-types of text/html', function(done) {
      givenErrorHandlerForError(new Error('Some error'), {
        defaultType: 'application/json',
      });
      request.get('/')
        // text/html will be used because its provided first
        .set('Accept', 'text/html, application/json')
        .expect('Content-Type', /^text\/html/, done);
    });

    it('picks first supported type upon multiple accepted', function(done) {
      givenErrorHandlerForError(new Error('Some error'), {
        defaultType: 'application/json',
      });
      request.get('/')
        .set('Accept', '*/*, not-supported, text/html, application/json')
        .expect('Content-Type', /^text\/html/, done);
    });

    it('falls back for unsupported option.defaultType', function(done) {
      givenErrorHandlerForError(new Error('Some error'), {
        defaultType: 'unsupported',
      });
      request.get('/')
        .set('Accept', '*/*')
        .expect('Content-Type', /^application\/json/, done);
    });

    it('returns defaultType for unsupported type', function(done) {
      givenErrorHandlerForError(new Error('Some error'), {
        defaultType: 'text/html',
      });
      request.get('/')
        .set('Accept', 'unsupported/type')
        .expect('Content-Type', /^text\/html/, done);
    });

    it('supports query _format', function(done) {
      givenErrorHandlerForError(new Error('Some error'), {
        defaultType: 'text/html',
      });
      request.get('/?_format=html')
        .set('Accept', 'application/json')
        .expect('Content-Type', /^text\/html/, done);
    });

    it('handles unknown _format query', function() {
      givenErrorHandlerForError();
      return request.get('/?_format=unknown')
        .expect('X-Warning', /_format.*not supported/);
    });
  });

  it('does not modify "options" argument', function(done) {
    const options = {log: false, debug: false};
    givenErrorHandlerForError(new Error(), options);
    request.get('/').end(function(err) {
      if (err) return done(err);
      expect(options).to.eql({log: false, debug: false});
      done();
    });
  });
});

let app, _requestHandler, request, server;
function resetRequestHandler() {
  _requestHandler = null;
}

function givenErrorHandlerForError(error, options) {
  if (!error) error = new Error('an error');

  if (!options) options = {};
  if (!('log' in options)) {
    // Disable logging to console by default, so that we don't spam
    // console output. One can use "DEBUG=strong-error-handler" when
    // troubleshooting.
    options.log = false;
  }

  const handler = strongErrorHandler(options);
  _requestHandler = function(req, res, next) {
    debug('Invoking strong-error-handler');
    handler(error, req, res, next);
  };
}

function setupHttpServerAndClient(done) {
  app = express();
  app.use(function(req, res, next) {
    if (!_requestHandler) {
      const msg = 'Error handler middleware was not setup in this test';
      console.error(msg);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end(msg);
      return;
    }

    _requestHandler(req, res, warnUnhandledError);

    function warnUnhandledError(err) {
      console.log('unexpected: strong-error-handler called next with',
        (err && (err.stack || err)) || 'no error');
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end(err ?
        'Unhandled strong-error-handler error:\n' + (err.stack || err) :
        'The error was silently discared by strong-error-handler');
    }
  });

  server = app.listen(0, function() {
    const url = 'http://127.0.0.1:' + this.address().port;
    debug('Test server listening on %s', url);
    request = supertest(app);
    done();
  })
    .once('error', function(err) {
      debug('Cannot setup HTTP server: %s', err.stack);
      done(err);
    });
}

function stopHttpServerAndClient() {
  server.close();
}

function ErrorWithProps(props) {
  this.name = props.name || 'ErrorWithProps';
  for (const p in props) {
    this[p] = props[p];
  }

  if (Error.captureStackTrace) {
    // V8 (Chrome, Opera, Node)
    Error.captureStackTrace(this, this.constructor);
  }
}
util.inherits(ErrorWithProps, Error);

function getExpectedErrorData(err) {
  const data = {};
  cloneAllProperties(data, err);
  return data;
}
