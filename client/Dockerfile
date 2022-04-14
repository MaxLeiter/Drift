FROM node:17-alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

FROM deps AS builder

WORKDIR /app

COPY . .

ARG API_URL

ENV NEXT_TELEMETRY_DISABLED=1
ENV API_URL=${API_URL:-http://localhost:3000}

RUN yarn build

FROM builder AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs  && \
  chown  nextjs:nodejs /app/.next/standalone && \
  chown  nextjs:nodejs /app/.next/static && \
  cp --recursive /app/.next/standalone/* /app

USER nextjs

ENV PORT=3001

EXPOSE ${PORT}

CMD ["node", "server.js"]
