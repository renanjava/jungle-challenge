### Multi-stage Dockerfile for api-gateway (NestJS)
### Builder & runtime use Node 18.19.0 (backend)

# --- Dependencies stage ---
FROM node:18.19.0 AS deps
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Copy workspace manifests and lockfile first for dependency install
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY packages ./packages
COPY apps/api-gateway ./apps/api-gateway

RUN pnpm install --frozen-lockfile --prefer-offline

# --- Development stage ---
FROM node:18.19.0 AS development
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependencies and source code
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app ./

ENV NODE_ENV=development
EXPOSE 3001

# Start NestJS in watch mode (hot reload)
CMD ["pnpm", "--filter", "api-gateway", "run", "start:dev"]

# --- Builder stage ---
FROM node:18.19.0 AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps/api-gateway ./apps/api-gateway

# Copy workspace config files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./

# Copy all apps (needed for monorepo workspace resolution)
COPY apps ./apps

# Build only the api-gateway package using tsc
WORKDIR /app/apps/api-gateway
RUN pnpm exec tsc -p tsconfig.build.json

# --- Production runner stage ---
FROM node:18.19.0 AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built output and node_modules
COPY --from=builder /app/apps/api-gateway/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/api-gateway/package.json ./package.json

EXPOSE 3001

CMD ["node", "dist/main"]
