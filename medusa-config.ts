import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

const redisUrl = process.env.REDIS_URL

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    // Medusa turns on TLS to Postgres in production; Railway's private network
    // Postgres has no TLS, and `medusa db:migrate` then hangs for 10s and dies.
    databaseDriverOptions:
      process.env.DATABASE_SSL === "true" ? {} : { connection: { ssl: false } },
    redisUrl,
    workerMode: (process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server") || "shared",
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },
  // Redis-backed infrastructure so the server and worker instances share
  // events, workflows, cache and locks (the in-memory defaults are per-process).
  modules: redisUrl
    ? [
        {
          resolve: "@medusajs/medusa/caching",
          options: {
            providers: [
              {
                resolve: "@medusajs/caching-redis",
                id: "caching-redis",
                is_default: true,
                options: { redisUrl },
              },
            ],
          },
        },
        { resolve: "@medusajs/medusa/event-bus-redis", options: { redisUrl } },
        { resolve: "@medusajs/medusa/workflow-engine-redis", options: { redis: { redisUrl } } },
        {
          resolve: "@medusajs/medusa/locking",
          options: {
            providers: [
              {
                resolve: "@medusajs/medusa/locking-redis",
                id: "locking-redis",
                is_default: true,
                options: { redisUrl },
              },
            ],
          },
        },
      ]
    : [],
})
