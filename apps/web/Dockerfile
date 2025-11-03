### Multi-stage Dockerfile for web (React + Vite)
### Build stage uses Node 22.20.0, final runtime uses Node 18.19.0 as requested

# --- Dependencies stage ---
FROM node:18.19.0 AS deps
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Copy workspace files and source
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY packages ./packages
COPY apps/web ./apps/web

RUN pnpm install --frozen-lockfile --prefer-offline

# --- Development stage ---
FROM node:22.20.0 AS development
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependencies and project files
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app ./

ENV NODE_ENV=development
EXPOSE 3000

# Run the Vite dev server with hot reload
CMD ["pnpm", "--filter", "web", "run", "dev"]

# --- Builder stage ---
FROM node:22.20.0 AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps/web ./apps/web
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./

WORKDIR /app/apps/web
RUN pnpm build

# --- Runner (Production) stage ---
FROM node:18.19.0 AS runner
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy built static files
COPY --from=builder /app/apps/web/dist ./dist

# Install a lightweight static server to serve the build
RUN npm install -g serve@14

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
