FROM postgres:16-alpine

# PGDATA one level below the mount: Railway volumes arrive with lost+found,
# which initdb refuses to initialize into.
ENV POSTGRES_USER=postgres \
    POSTGRES_DB=medusa \
    PGDATA=/var/lib/postgresql/data/pgdata
