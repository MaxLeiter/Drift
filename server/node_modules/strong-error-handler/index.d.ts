// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: strong-error-handler
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

// Type definitions for strong-error-handler 3.x
// Project: https://github.com/strongloop/strong-error-handler
// Definitions by: Kyusung Shim <https://github.com/shimks>
// TypeScript Version: 3.0

import * as Express from 'express';

export = errorHandlerFactory;

/**
 * Creates a middleware function for error-handling
 * @param options Options for error handler settings
 */
declare function errorHandlerFactory(
  options?: errorHandlerFactory.ErrorHandlerOptions
): errorHandlerFactory.StrongErrorHandler;

declare namespace errorHandlerFactory {
  /**
   * Writes thrown error to response
   * @param err Error to handle
   * @param req Incoming request
   * @param res Response
   * @param options Options for error handler settings
   */
  function writeErrorToResponse(
    err: Error,
    req: Express.Request,
    res: Express.Response,
    options?: ErrorWriterOptions
  ): void;

  /**
   * Error-handling middleware function. Includes server-side logging
   */
  type StrongErrorHandler = (
    err: Error,
    req: Express.Request,
    res: Express.Response,
    next: (err?: any) => void
  ) => void;

  /**
   * Options for writing errors to the response
   */
  interface ErrorWriterOptions {
    debug?: boolean;
    safeFields?: string[];
    defaultType?: string;
    negotiateContentType?: boolean;
    rootProperty?: string | false;
  }

  /**
   * Options for error-handling
   */
  interface ErrorHandlerOptions extends ErrorWriterOptions {
    log?: boolean;
  }
}
