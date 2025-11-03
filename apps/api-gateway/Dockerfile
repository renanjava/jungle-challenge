### Multi-stage Dockerfile for api-gateway (NestJS)

# --- Dependencies stage ---
FROM node:18.19.0 AS deps
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY packages ./packages
COPY apps/api-gateway ./apps/api-gateway

RUN pnpm install --frozen-lockfile --prefer-offline

# --- Development stage ---
FROM node:18.19.0 AS development
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Copia dependências e código
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app ./

ENV NODE_ENV=development
EXPOSE 3001

# Rodar com hot reload - executa diretamente do diretório do app
WORKDIR /app/apps/api-gateway
CMD ["pnpm", "run", "start:dev"]

# --- Builder stage ---
FROM node:18.19.0 AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps/api-gateway ./apps/api-gateway

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY apps ./apps

WORKDIR /app/apps/api-gateway
RUN pnpm exec tsc -p tsconfig.build.json

# --- Runner (production) stage ---
FROM node:18.19.0 AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/api-gateway/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/api-gateway/package.json ./package.json

EXPOSE 3001
CMD ["node", "dist/main"]