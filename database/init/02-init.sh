#!/bin/bash
echo "Seeding TLE data..."
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "\copy satellite_tles FROM '/docker-entrypoint-initdb.d/satellite_tles.csv' WITH CSV HEADER;"
