# Deploy and Host Medusa v2 on Railway

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/medusa-commerce?referralCode=sLjDXb&utm_medium=integration&utm_source=button&utm_campaign=medusa-commerce)

[Medusa](https://medusajs.com/) is the open-source headless commerce platform: a Node.js backend with a modular commerce engine (products, carts, orders, pricing, promotions, fulfillment, payments) and a built-in admin dashboard. This template runs Medusa 2.x the way its deployment guide asks for: a server instance that serves the API and admin, a separate worker instance for background jobs, Postgres, and Redis for cache, events, workflows and locks.

## About Hosting Medusa v2

Four services from one repo. The Medusa image is built from a stock `create-medusa-app` project with a production Dockerfile, so you can fork the repo and add modules, plugins or custom API routes. On boot the server runs migrations, creates the first admin user from `MEDUSA_ADMIN_EMAIL` / `MEDUSA_ADMIN_PASSWORD` if it does not exist yet, then starts. The worker waits for those migrations and then starts in worker mode. Redis-backed caching, event bus, workflow engine and locking modules are configured so both instances share state. Uploaded files are stored on a volume at `/app/static`.

## Common Use Cases

- Headless commerce backend for a Next.js, Remix or mobile storefront
- Replacing a Shopify store with an open-source, fully customisable engine
- B2B commerce, marketplaces, subscriptions or digital products built on Medusa's workflows
- A staging Medusa backend for a team building custom modules

## Dependencies for Medusa v2 Hosting

- Postgres 16 (included, with a volume)
- Redis 7 (included, with a volume)

### Deployment Dependencies

- [Medusa deployment guide](https://docs.medusajs.com/learn/deployment/general)
- [Medusa configuration reference](https://docs.medusajs.com/learn/configurations/medusa-config)
- Template source: [nomideusz/medusa-railway](https://github.com/nomideusz/medusa-railway)

### Implementation Details

**First use:** open `https://<server domain>/app` and log in with `MEDUSA_ADMIN_EMAIL` and the generated `MEDUSA_ADMIN_PASSWORD` (server service, Variables tab). Change the password from the admin afterwards. The API is at the same domain; `/health` returns `OK`.

**Connecting a storefront:** set `STORE_CORS` and add your storefront URL to `AUTH_CORS`, then create a publishable API key in the admin (Settings → Publishable API Keys) for the storefront's requests. The Medusa Next.js starter works out of the box with `MEDUSA_BACKEND_URL` pointed at this server.

**Customising:** fork the repo, edit `src/` (API routes, modules, subscribers, workflows, admin extensions) and point both the `server` and `worker` services at your fork. `medusa-config.ts` reads everything from environment variables.

Notes and limits:

- Uploads use Medusa's local file provider on the `/app/static` volume. For a CDN-backed store, switch to the S3 file provider with a Railway bucket.
- Postgres on Railway's private network has no TLS, so the config disables SSL for the database connection. Set `DATABASE_SSL=true` if you point it at an external TLS database.
- Give the server 1 GB of RAM or more; the worker is lighter.
- Payments and email are not configured. Add the Stripe payment provider and a notification provider in `medusa-config.ts` when you go live.

## Why Deploy Medusa v2 on Railway?

Railway is a singular platform to deploy your infrastructure stack. Railway will host your infrastructure so you don't have to deal with configuration, while allowing you to vertically and horizontally scale it.

By deploying Medusa v2 on Railway, you are one step closer to supporting a complete full-stack application with minimal burden. Host your servers, databases, AI agents, and more on Railway.
