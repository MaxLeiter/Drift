# Installation
> `npm install --save @types/express-unless`

# Summary
This package contains type definitions for express-unless (https://www.npmjs.org/package/express-unless).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/express-unless.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/express-unless/index.d.ts)
````ts
// Type definitions for express-unless 0.5
// Project: https://www.npmjs.org/package/express-unless
// Definitions by: Wonshik Kim <https://github.com/wokim>
//                 Joao Vieira <https://github.com/joaovieira>
//                 Michal Kaminski <https://github.com/michal-b-kaminski>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

import express = require("express");

declare function unless(options: unless.Options): express.RequestHandler;
declare function unless(options: unless.Options["custom"]): express.RequestHandler;
declare function unless(middleware: express.RequestHandler, options: unless.Options): express.RequestHandler;

declare namespace unless {
    type pathFilter = string | RegExp | { url: string | RegExp, methods?: string[] | undefined, method?: string | string[] | undefined };

    export interface Options {
        custom?: ((req: express.Request) => boolean) | undefined;
        path?: pathFilter | pathFilter[] | undefined;
        ext?: string | string[] | undefined;
        method?: string | string[] | undefined;
        useOriginalUrl?: boolean | undefined;
    }
    export interface RequestHandler extends express.RequestHandler {
        unless?: typeof unless | undefined;
    }
}

export = unless;

````

### Additional Details
 * Last updated: Thu, 10 Feb 2022 07:31:36 GMT
 * Dependencies: [@types/express](https://npmjs.com/package/@types/express)
 * Global values: none

# Credits
These definitions were written by [Wonshik Kim](https://github.com/wokim), [Joao Vieira](https://github.com/joaovieira), and [Michal Kaminski](https://github.com/michal-b-kaminski).
