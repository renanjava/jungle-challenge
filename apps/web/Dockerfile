### Multi-stage Dockerfile for web (React + Vite)

# --- Dependencies stage ---
FROM node:22.20.0 AS deps
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY packages ./packages
COPY apps/web ./apps/web

RUN pnpm install --frozen-lockfile --prefer-offline

# --- Development stage ---
FROM node:22.20.0 AS development
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Copia dependências e código
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app ./

ENV NODE_ENV=development
EXPOSE 3000

# Muda para o diretório do web app
WORKDIR /app/apps/web

# Vite precisa do --host 0.0.0.0 para aceitar conexões externas
CMD ["pnpm", "run", "dev", "--host", "0.0.0.0"]

# --- Builder stage ---
FROM node:22.20.0 AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps/web ./apps/web
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./

WORKDIR /app/apps/web
RUN pnpm build

# --- Runner (production) stage ---
FROM node:18.19.0 AS runner
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app/apps/web/dist ./dist

RUN npm install -g serve@14

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]