FROM node:18.19.0-alpine AS deps
RUN apk add --no-cache bash git python3 make g++ \
    && corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY packages ./packages
COPY apps/auth-service ./apps/auth-service

RUN pnpm install --frozen-lockfile --prefer-offline

FROM node:18.19.0-alpine AS development
RUN apk add --no-cache bash
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app ./

ENV NODE_ENV=development
EXPOSE 3002
WORKDIR /app/apps/auth-service
CMD ["pnpm", "run", "start:dev"]

FROM node:18.19.0-alpine AS builder
RUN apk add --no-cache bash
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps/auth-service ./apps/auth-service
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY apps ./apps

WORKDIR /app/apps/auth-service
RUN pnpm exec tsc -p tsconfig.build.json

FROM node:18.19.0-alpine AS runner
RUN apk add --no-cache bash
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/auth-service/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/auth-service/package.json ./package.json

COPY --from=builder /app/apps/auth-service/src/migrations ./src/migrations
COPY --from=builder /app/apps/auth-service/src/data-source.ts ./src/data-source.ts

EXPOSE 3002
CMD ["sh", "-c", "pnpm run migration:run && node dist/main"]
