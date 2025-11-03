### Multi-stage Dockerfile for tasks-service (NestJS)

# --- Dependencies stage ---
FROM node:18.19.0-alpine AS deps
RUN apk add --no-cache bash git python3 make g++ \
    && corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY packages ./packages
COPY apps/tasks-service ./apps/tasks-service

RUN pnpm install --frozen-lockfile --prefer-offline

# --- Development stage ---
FROM node:18.19.0-alpine AS development
RUN apk add --no-cache bash
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app ./

ENV NODE_ENV=development
EXPOSE 3003

WORKDIR /app/apps/tasks-service
CMD ["pnpm", "run", "start:dev"]

# --- Builder stage ---
FROM node:18.19.0-alpine AS builder
RUN apk add --no-cache bash
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps/tasks-service ./apps/tasks-service
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY apps ./apps

WORKDIR /app/apps/tasks-service
RUN pnpm exec tsc -p tsconfig.build.json

# --- Runner (production) stage ---
FROM node:18.19.0-alpine AS runner
RUN apk add --no-cache bash
WORKDIR /app
ENV NODE_ENV=production

# Copia build e dependências
COPY --from=builder /app/apps/tasks-service/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/tasks-service/package.json ./package.json

# Copia migrations e data-source
COPY --from=builder /app/apps/tasks-service/src/migrations ./src/migrations
COPY --from=builder /app/apps/tasks-service/src/data-source.ts ./src/data-source.ts

EXPOSE 3003

# Roda migrations antes de iniciar o app
CMD ["sh", "-c", "npm run migration:run && node dist/main"]
