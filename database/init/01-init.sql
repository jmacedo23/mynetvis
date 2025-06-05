CREATE TABLE satellite_tles (
  satellite_id TEXT,
  name TEXT,
  tle_line1 TEXT,
  tle_line2 TEXT,
  epoch TIMESTAMPTZ,
  PRIMARY KEY (satellite_id, epoch)
);
