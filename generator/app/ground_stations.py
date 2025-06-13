import psycopg2
import os

GROUND_STATIONS = [
    ("New York", 40.7128, -74.0060),
    ("Los Angeles", 34.0522, -118.2437),
    ("London", 51.5074, -0.1278),
    ("Tokyo", 35.6895, 139.6917),
    ("Sydney", -33.8688, 151.2093),
    ("Paris", 48.8566, 2.3522),
    ("Moscow", 55.7558, 37.6173),
    ("Dubai", 25.2048, 55.2708),
    ("Sao Paulo", -23.5505, -46.6333),
    ("Johannesburg", -26.2041, 28.0473),
]


def populate_ground_stations():
    conn = psycopg2.connect(
        host=os.getenv("POSTGRES_HOST", "database"),
        dbname=os.getenv("POSTGRES_DB", "netvis"),
        user=os.getenv("POSTGRES_USER", "netvis"),
        password=os.getenv("POSTGRES_PASSWORD", "netvis"),
        port=os.getenv("POSTGRES_PORT", "5432"),
    )
    cur = conn.cursor()
    for name, lat, lon in GROUND_STATIONS:
        cur.execute(
            """
            INSERT INTO ground_stations (name, lat, lon)
            VALUES (%s, %s, %s)
            ON CONFLICT (name) DO NOTHING;
            """,
            (name, lat, lon),
        )
    conn.commit()
    cur.close()
    conn.close()

