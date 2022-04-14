# <img src="client/public/assets/logo.png" height="32px" alt="" /> Drift

Drift is a self-hostable Gist clone. It's also a major work-in-progress, but is completely functional.

You can try a demo at https://drift.maxleiter.com. The demo is built on master but has no database, so files and accounts can be wiped at any time.

If you want to contribute, need support, or want to stay updated, you can join the IRC channel at #drift on irc.libera.chat or [reach me on twitter](https://twitter.com/Max_Leiter). If you don't have an IRC client yet, you can use a webclient [here](https://demo.thelounge.chat/#/connect?join=%23drift&nick=drift-user&realname=Drift%20User). 
<hr />

**Contents:**
- [Setup](#setup)
  - [Development](#development)
  - [Production](#production)
- [Environment variables](#environment-variables)
- [Running with pm2](#running-with-pm2)
- [Running with Docker](#running-with-docker)
- [Current status](#current-status)

## Setup

### Development

In both `server` and `client`, run `yarn` (if you need yarn, you can download it [here](https://yarnpkg.com/).)
You can run `yarn dev` in either / both folders to start the server and client with file watching / live reloading.

To migrate the sqlite database in development, you can use `yarn migrate` to see a list of options.

### Production

`yarn build` in both `client/` and `server/` will produce production code for the client and server respectively. 

If you're deploying the front-end to something like Vercel, you'll need to set the root folder to `client/`.

In production the sqlite database will be automatically migrated to the latest version.

### Environment Variables

You can change these to your liking.

`client/.env`:

- `API_URL`: defaults to localhost:3001, but allows you to host the front-end separately from the backend on a service like Vercel or Netlify
- `SECRET_KEY`: a secret key used for validating API requests that is never exposed to the browser

`server/.env`:

- `PORT`: the default port to start the server on (3000 by default)
- `NODE_ENV`: defaults to development, can be `production`
- `JWT_SECRET`: a secure token for JWT tokens. You can generate one [here](https://www.grc.com/passwords.htm).
- `MEMORY_DB`: if `true`, a sqlite database will not be created and changes will only exist in memory. Mainly for the demo.
- `REGISTRATION_PASSWORD`: if `true`, the user will be required to provide this password to sign-up, in addition to their username and account password. If it's not set, no additional password will be required.
- `SECRET_KEY`: the same secret key as the client
- `WELCOME_CONTENT`: a markdown string that's rendered on the home page
- `WELCOME_TITLE`: the file title for the post on the homepage.
- `ENABLE_ADMIN`: the first account created is an administrator account
- `DRIFT_HOME`: defaults to ~/.drift, the directory for storing the database and eventually images

## Running with pm2

It's easy to start Drift using [pm2](https://pm2.keymetrics.io/).
First, add `.env` files to `client/` and `server/` with the values you want (see the above section for possible values).
Then, use the following commands to start the client and server:

- `cd server && yarn build && pm2 start yarn --name drift-server --interpreter bash -- start`
- `cd ..`
- `cd client && yarn build && pm2 start yarn --name drift-client --interpreter bash -- start`

You now use `pm2 ls` to see their statuses. Refer to pm2's docs or `pm2 help` for more information.

## Running with Docker

The client and server each have Dockerfiles ([client](https://github.com/MaxLeiter/Drift/blob/main/client/Dockerfile), [server](https://github.com/MaxLeiter/Drift/blob/main/server/Dockerfile)) you can use with a docker-compose; an example compose [is provided in the repository](https://github.com/MaxLeiter/Drift/blob/main/docker-compose.yml). It's recommended you pair running them with nginx or another reverse proxy. Also review the environment variables above and configure them to your liking.

## Current status

Drift is a major work in progress. Below is a (rough) list of completed and envisioned features. If you want to help address any of them, please let me know regardless of your experience and I'll be happy to assist.

- [x] creating and sharing private, public, unlisted posts
  - [x] syntax highlighting (detected by file extension)
  - [x] multiple files per post
  - [x] uploading files via drag-and-drop
- [x] responsive UI
- [x] user auth
  - [ ] SSO via HTTP header (Issue: [#11](https://github.com/MaxLeiter/Drift/issues/11))
- [x] downloading files (individually and entire posts)
- [x] password protected posts
- [x] sqlite database
- [ ] administrator account / settings
- [x] docker-compose (PRs: [#13](https://github.com/MaxLeiter/Drift/pull/13), [#75](https://github.com/MaxLeiter/Drift/pull/75))
  - [ ] publish docker builds
- [ ] user settings
- [ ] works enough with JavaScript disabled
- [x] documentation
- [x] customizable homepage, so the demo can exist as-is but other instances can be built from the same source. Environment variable for the file contents?
