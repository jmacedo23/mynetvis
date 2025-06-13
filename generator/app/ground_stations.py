from .fetch import wait_for_db

GROUND_STATIONS = [
    {"name": "New York", "lat": 40.7128, "lon": -74.0060},
    {"name": "London", "lat": 51.5074, "lon": -0.1278},
    {"name": "Tokyo", "lat": 35.6895, "lon": 139.6917},
    {"name": "Sydney", "lat": -33.8688, "lon": 151.2093},
    {"name": "Rio de Janeiro", "lat": -22.9068, "lon": -43.1729},
    {"name": "Cape Town", "lat": -33.9249, "lon": 18.4241},
    {"name": "Moscow", "lat": 55.7558, "lon": 37.6173},
    {"name": "Singapore", "lat": 1.3521, "lon": 103.8198},
    {"name": "Dubai", "lat": 25.2048, "lon": 55.2708},
    {"name": "Los Angeles", "lat": 34.0522, "lon": -118.2437},
]


def insert_ground_stations():
    conn = wait_for_db()
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS ground_stations (
            id SERIAL PRIMARY KEY,
            name TEXT UNIQUE,
            lat DOUBLE PRECISION,
            lon DOUBLE PRECISION
        );
        """
    )

    for gs in GROUND_STATIONS:
        cur.execute(
            """
            INSERT INTO ground_stations (name, lat, lon)
            VALUES (%s, %s, %s)
            ON CONFLICT (name) DO NOTHING;
            """,
            (gs["name"], gs["lat"], gs["lon"]),
        )

    conn.commit()
    cur.close()
    conn.close()
    print("✅ Ground stations inserted.")
