-- Enable TimescaleDB and create hypertable for TLE storage
CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE IF NOT EXISTS satellite_tles (
  satellite_id TEXT,
  name TEXT,
  tle_line1 TEXT,
  tle_line2 TEXT,
  epoch TIMESTAMPTZ,
  PRIMARY KEY (satellite_id, epoch)
);

SELECT create_hypertable('satellite_tles', 'epoch', if_not_exists => TRUE);

CREATE TABLE IF NOT EXISTS ground_stations (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION
);
