# Medusa v2 — one image for both the server and the worker (MEDUSA_WORKER_MODE).
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npx medusa build && cd .medusa/server && npm install --omit=dev --no-audit --no-fund

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production PORT=9000
COPY --from=build /app/.medusa/server ./
COPY entrypoint.sh /
COPY wait-for-migrations.js ./
RUN chmod +x /entrypoint.sh && mkdir -p /app/static
EXPOSE 9000
ENTRYPOINT ["/entrypoint.sh"]
