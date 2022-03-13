# <img src="client/public/assets/logo.png" height="32px" alt="" /> Drift

Drift is a self-hostable Gist clone. It's also a major work-in-progress, but is (almost, no database yet) completely functional.

You can try a demo at https://drift.maxleiter.com. The demo is built on master but has no database, so files and accounts can be wiped at any time.

If you want to contribute, need support, or want to stay updated, you can join the IRC channel at #drift on irc.libera.chat or [reach me on twitter](https://twitter.com/Max_Leiter). If you don't have an IRC client yet, you can use a webclient [here](https://demo.thelounge.chat/#/connect?join=%23drift&nick=drift-user&realname=Drift%20User).

## Setup

### Development

In both `server` and `client`, run `yarn` (if you need yarn, you can download it [here](https://yarnpkg.com/).)
You can run `yarn dev` in either / both folders to start the server and client with file watching / live reloading.

### Production

**Note: Drift is not yet ready for production usage and should not be used seriously until the database has been setup, which I'll get to when the server API is semi stable.**

`yarn build` in both `client/` and `server/` will produce production code for the client and server respectively. The client and server each also have Dockerfiles which you can use with a docker-compose (see the next section).

If you're deploying the front-end to something like Vercel, you'll need to set the root folder to `client/`.

### Docker Compose

Here's an example `docker-compose.yml`:

```yaml
version: '3.8'

services:
  server:
    build: ./server
    restart: unless-stopped
    user: 1000:1000
    environment:
      - "JWT_SECRET=change_me!" # use `openssl rand -hex 32` to generate a strong secret
    expose:
      - 3000

  client:
    build: ./client
    restart: unless-stopped
    user: 1000:1000
    environment:
      - "API_URL=" # not working
    expose:
      - 3001
```

The important thing to note is that the client and server both need to be accessible to the outside for a public instance to work. In a simple single-purpose stack adding an Nginx reverse proxy should be sufficient:

```yaml
  proxy:
    image: nginx:alpine
    restart: unless-stopped
    depends_on:
      - server
      - client
    ports:
      - "80:80"
    volumes:
      - "./nginx.conf:/etc/nginx/nginx.conf:ro"
```

`nginx.conf`:  
```nginx
events {}
http {
  server {
    listen 80;

    location / {
      proxy_pass http://client:3001/;
    }

    location /api/ {
      proxy_pass http://server:3000/;
    }
  }
}
```

## Current status

Drit is a major work in progress. Below is a (rough) list of completed and envisioned features. If you want to help address any of them, please let me know regardless of your experience and I'll be happy to assist.

- [x] creating and sharing private, public, unlisted posts
  - [x] syntax highlighting (detected by file extension)
  - [x] multiple files per post
  - [x] uploading files via drag-and-drop
- [x] responsive UI
- [x] user auth
  - [ ] SSO via HTTP header (Issue: [#11](https://github.com/MaxLeiter/Drift/issues/11))
- [x] downloading files (individually and entire posts)
- [ ] password protected posts
- [ ] sqlite database (should be very easy to set-up; the ORM is just currently set to memory for ease of development)
- [ ] non-node backend
- [ ] administrator account / settings
- [ ] docker-compose (PR: [#13](https://github.com/MaxLeiter/Drift/pull/13))
  - [ ] publish docker builds
- [ ] user settings
- [ ] works enough with JavaScript disabled
- [ ] documentation
- [x] customizable homepage, so the demo can exist as-is but other instances can be built from the same source. Environment variable for the file contents?
