FROM node:17-alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat git

WORKDIR /app

COPY package.json yarn.lock tsconfig.json tslint.json ./

RUN yarn install --frozen-lockfile

FROM deps AS builder

WORKDIR /app

COPY . .

RUN apk add --no-cache git && \
  yarn build:docker

FROM builder AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 drift

USER drift

ENV PORT=3000

EXPOSE ${PORT}

CMD ["node", "dist/index.js"]
