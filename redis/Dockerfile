FROM redis:7-alpine

# No config file → redis binds all interfaces including IPv6 (required on
# Railway's private network). noeviction: Medusa's event bus and workflow
# engine keep state in Redis; appendonly + /data volume keeps it across restarts.
CMD ["sh", "-c", "redis-server --appendonly yes --maxmemory-policy noeviction --requirepass \"$REDIS_PASSWORD\""]
