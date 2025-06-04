FROM timescale/timescaledb:latest-pg14

# Copy all init files into the entrypoint directory
COPY init/ /docker-entrypoint-initdb.d/

RUN chmod +x /docker-entrypoint-initdb.d/02-init.sh
