#!/bin/sh
set -e
cd /app

if [ "${MEDUSA_WORKER_MODE:-server}" != "worker" ]; then
  npx medusa db:migrate
  # Idempotent first-boot admin: `medusa user` fails if the email exists — fine.
  if [ -n "$MEDUSA_ADMIN_EMAIL" ] && [ -n "$MEDUSA_ADMIN_PASSWORD" ]; then
    npx medusa user -e "$MEDUSA_ADMIN_EMAIL" -p "$MEDUSA_ADMIN_PASSWORD" \
      && echo "== admin user $MEDUSA_ADMIN_EMAIL created" \
      || echo "== admin user $MEDUSA_ADMIN_EMAIL already exists (or creation failed above)"
  fi
else
  until node wait-for-migrations.js; do echo "== waiting for the server to run migrations..."; sleep 5; done
fi

exec npm run start
