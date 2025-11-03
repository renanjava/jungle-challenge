FROM node:18.19.0 AS deps
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY packages ./packages
COPY apps/tasks-service ./apps/tasks-service
RUN pnpm install --frozen-lockfile --prefer-offline

FROM node:18.19.0 AS development
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app ./
ENV NODE_ENV=development
CMD ["pnpm", "--filter", "tasks-service", "run", "start:dev"]

FROM node:18.19.0 AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps/tasks-service ./apps/tasks-service
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY apps ./apps
WORKDIR /app/apps/tasks-service
RUN pnpm exec tsc -p tsconfig.build.json

FROM node:18.19.0 AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/tasks-service/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/tasks-service/package.json ./package.json
CMD ["node", "dist/main"]
