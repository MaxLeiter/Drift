# Install dependencies only when needed
FROM node:17-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat git

WORKDIR /app

COPY package.json yarn.lock tsconfig.json tslint.json ./

RUN yarn install --frozen-lockfile

# If using npm with a `package-lock.json` comment out above and use below instead
# COPY package.json package-lock.json ./ 
# RUN npm ci

# Rebuild the source code only when needed
FROM node:17-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG SECRET_KEY
ARG NODE_ENV

ENV SECRET_KEY=${SECRET_KEY:-secret}
ENV NODE_ENV=${NODE_ENV:-production}

RUN apk add --no-cache git

RUN yarn build:docker

FROM node:17-alpine AS runner

WORKDIR /app

ARG NODE_ENV

ENV NODE_ENV=${NODE_ENV:-production}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 drift

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

USER drift

EXPOSE 3000

ENV PORT 3000

CMD ["node", "dist/index.js"]
