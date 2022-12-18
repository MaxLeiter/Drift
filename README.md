# <img src="client/public/assets/logo.png" height="32px" alt="" /> Drift

> **Note:** This branch is where all work is being done to refactor to the Next.js 13 app directory and React Server Components.

Drift is a self-hostable Gist clone. It's in beta, but is completely functional.

You can try a demo at https://drift.lol. The demo is built on main but has no database, so files and accounts can be wiped at any time.

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

In the `src/` directory, run `pnpm i`. If you need `pnpm`, you can download it [here](https://pnpm.io/installation).
You can run `pnpm dev` in `client` for file watching and live reloading.

To work with [prisma](prisma.io/), you can use `pnpm prisma` or `pnpm exec prisma` to interact with the database.

### Production

`pnpm build` in `src/` will produce production code. `pnpm start` will run the Next.js server.

### Environment Variables

You can change these to your liking.

`src/.env`:

- `DRIFT_URL`: the URL of the drift instance.
- `DATABASE_URL`: the URL to connect to your postgres instance. For example, `postgresql://user:password@localhost:5432/drift`.
- `WELCOME_CONTENT`: a markdown string that's rendered on the home page
- `WELCOME_TITLE`: the file title for the post on the homepage.
- `ENABLE_ADMIN`: the first account created is an administrator account
- `REGISTRATION_PASSWORD`: the password required to register an account. If not set, no password is required.
- `NODE_ENV`: defaults to development, can be `production`

#### Auth environment variables
**Note:** Only credential auth currently supports the registration password, so if you want to secure registration, you must use only credential auth.

- `GITHUB_CLIENT_ID`: the client ID for GitHub OAuth.
- `GITHUB_CLIENT_SECRET`: the client secret for GitHub OAuth.
- `NEXTAUTH_URL`: the URL of the drift instance. Not required if hosting on Vercel.
- `CREDENTIAL_AUTH`: whether to allow username/password authentication. Defaults to `true`.

## Running with pm2

It's easy to start Drift using [pm2](https://pm2.keymetrics.io/).
First, add the `.env` file to `src/` with your values (see the above section for the required options).

Then, use the following command to start the server:

- `cd src && pnpm build && pm2 start pnpm --name drift --interpreter bash -- start`

Refer to pm2's docs or `pm2 help` for more information.

## Running with Docker

## Current status

Drift is a work in progress. Below is a (rough) list of completed and envisioned features. If you want to help address any of them, please let me know regardless of your experience and I'll be happy to assist.

- [x] Next.js 13 `app` directory
- [x] creating and sharing private, public, password-protected, and unlisted posts
  - [x] syntax highlighting
  - [x] expiring posts
- [x] responsive UI
- [x] user auth
  - [ ] SSO via HTTP header (Issue: [#11](https://github.com/MaxLeiter/Drift/issues/11))
  - [x] SSO via GitHub OAuth
- [x] downloading files (individually and entire posts)
- [x] password protected posts
- [x] postgres database
- [x] administrator account / settings
- [x] docker-compose (PRs: [#13](https://github.com/MaxLeiter/Drift/pull/13), [#75](https://github.com/MaxLeiter/Drift/pull/75))
  - [ ] publish docker builds
- [ ] user settings
- [ ] works enough with JavaScript disabled
- [ ] in-depth documentation
- [x] customizable homepage, so the demo can exist as-is but other instances can be built from the same source. Environment variable for the file contents?
- [ ] fleshed out API
- [ ] Swappable database backends
- [ ] More OAuth providers
