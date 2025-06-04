CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE satellite_positions (
  time_sec INTEGER NOT NULL,
  obj_id INTEGER NOT NULL,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  alt_km DOUBLE PRECISION,
  PRIMARY KEY (time_sec, obj_id)
);

SELECT create_hypertable('satellite_positions', 'time_sec');
