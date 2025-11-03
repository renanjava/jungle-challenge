### Multi-stage Dockerfile for notifications-service (NestJS + WebSocket)

# --- Dependencies stage ---
FROM node:18.19.0 AS deps
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY packages ./packages
COPY apps/notifications-service ./apps/notifications-service

RUN pnpm install --frozen-lockfile --prefer-offline

# --- Development stage ---
FROM node:18.19.0 AS development
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Copia dependências e código
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app ./

ENV NODE_ENV=development
EXPOSE 3004

# Muda para o diretório do serviço
WORKDIR /app/apps/notifications-service

# Roda diretamente com npm (mais estável que pnpm para alguns casos)
CMD ["npm", "run", "start:dev"]

# --- Builder stage ---
FROM node:18.19.0 AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Copia dependências e código do stage anterior
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps/notifications-service ./apps/notifications-service

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY apps ./apps

WORKDIR /app/apps/notifications-service
RUN pnpm exec tsc -p tsconfig.build.json

# --- Runner (production) stage ---
FROM node:18.19.0 AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/notifications-service/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/notifications-service/package.json ./package.json

EXPOSE 3004
CMD ["node", "dist/main"]