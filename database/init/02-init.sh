#!/bin/bash
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "\copy satellite_positions FROM '/docker-entrypoint-initdb.d/satellite_positions.csv' WITH CSV HEADER;"
